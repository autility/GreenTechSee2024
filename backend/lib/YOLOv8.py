import json
import onnxruntime as ort
from flask import request, Flask, jsonify
from waitress import serve
from PIL import Image
import numpy as np
import cv2
from skimage import measure
from shapely.ops import unary_union
from shapely.geometry import Polygon
# from generate_planar_graph import generate_graph

from lib.jsonify_polygon import *

class YOLOv8Seg:
    """YOLOv8 segmentation model."""
    def __init__(self):
        """
            Initialization.

            Args:
                onnx_model (str): Path to ONNX model
        """
        # Build Ort session
        self.session = ort.InferenceSession("room.onnx",
                                            providers=['CUDAExecutionProvider', 'CPUExecutionProvider']
                                            if ort.get_device() == 'GPU' else ['CPUExecutionProvider'])
        # Numpy dtype: support both FP32 and FP16 onnx model
        self.ndtype = np.half if self.session.get_inputs()[0].type == 'tensor(float16)' else np.single
        # Get model width and height(YOLOv8Seg only has one input)
        self.model_height, self.model_width = [x.shape for x in self.session.get_inputs()][0][-2:]
        # Load COCO class names
        self.classes = {0: 'room'}

    def __call__(self, buf, conf_threshold=0.5, iou_threshold=0.5, nm=32):
        """
            The whole pipeline: pre-process -> inference -> post-process

            Args:
                im0 (Numpy.ndarray): original input image.
                conf_threshold (float): confidence threshold for filtering predictions.
                iou_threshold (float): iou threshold for NMS.
                nm (int): the number of masks
            
            Returns:
                boxes (List): list of bounding boxes.
                segments (List): list of segments.
                masks (np.ndarray): [N, H, W], output masks
        """
        im0 = Image.open(buf)
        im0 = np.array(im0.convert('RGB'))
        # Pre-process
        im, ratio, (pad_w, pad_h) = self.preprocess(im0)
        # Ort inference
        preds = self.session.run(None, {self.session.get_inputs()[0].name: im})
        # Post-process
        boxes, segments, masks = self.postprocess(preds,
                                                  im0=im0,
                                                  ratio=ratio,
                                                  pad_w=pad_w,
                                                  pad_h=pad_h,
                                                  conf_threshold=conf_threshold,
                                                  iou_threshold=iou_threshold,
                                                  nm=nm)
        return boxes, segments, masks
    
    def preprocess(self, img):
        """
            Pre-process the input image

            Args:
                img (Numpy.ndarray): image about to be processed

            Returns:
                img_process (Numpy.ndarray): image preprocessed for inference
                ratio (tuple): width, height ratios in letterbox
                pad_w (float): wudth padding in letterbox
                pad_h (float): height padding in letterbox
        """
        shape = img.shape[:2]
        new_shape = (self.model_height, self.model_width)
        r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
        ratio = r, r
        new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
        pad_w, pad_h = (new_shape[1] - new_unpad[0]) / 2, (new_shape[0] - new_unpad[1]) / 2
        if shape[::-1] != new_unpad:
            img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
        top, bottom = int(round(pad_h - 0.1)), int(round(pad_h + 0.1))
        left, right = int(round(pad_w - 0.1)), int(round(pad_w + 0.1))
        img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=(114, 114, 114))
        # Transforms HWC to CHW -> RGB to RGB -> div(255) -> continuous -> add axis(optional)
        img = np.ascontiguousarray(np.einsum('HWC->CHW', img)[::-1], dtype=self.ndtype)
        img_process = img[None] if len(img.shape) == 3 else img
        return img_process, ratio, (pad_w, pad_h)

    def postprocess(self, preds, im0, ratio, pad_w, pad_h, conf_threshold, iou_threshold, nm=32):
        """
        
        """
        x, protos = preds[0], preds[1]
        x = np.einsum('bnc->bnc', x)
        x = x[np.amax(x[..., 4:-nm], axis=-1) > conf_threshold]
        x = np.c_[x[..., :4], np.amax(x[..., 4:-nm], axis=-1), np.argmax(x[..., 4:-nm], axis=-1), x[..., -nm:]]
        x = x[cv2.dnn.NMSBoxes(x[:, :4], x[:, 4], conf_threshold, iou_threshold)]

        if len(x) > 0:
            # Bounding boxes format change: cxcywh -> xyxy
            x[..., [0, 1]] -= x[..., [2, 3]] / 2
            x[..., [2, 3]] += x[..., [0, 1]]
            # Rescale bounding boxes from model shape(height,width)
            x[..., :4] -= [pad_w, pad_h, pad_w, pad_h]
            x[..., :4] /= min(ratio)
            # Bounding boxes boundary clamp
            x[..., [0, 2]] = x[:, [0, 2]].clip(0, im0.shape[1])
            x[..., [1, 3]] = x[:, [1, 3]].clip(0, im0.shape[0])

            # Process masks
            masks = self.process_mask(protos[0], x[:, 6:], x[:, :4], im0.shape)

            # Masks -> segments(contours)
            segments = tuple(map(self.mask_to_shape, masks))
            return x[..., :6], list(segments), masks
        else:
            return [], [], []

    @staticmethod
    def masks2segments(masks):
        """

        """
        segments = []
        for x in masks.astype('uint8'):
            c = cv2.findContours(x, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]
            if c:
                c = c[np.array([len(x) for x in c]).argmax()]
                polygon = [[int(contour[0][0]), int(contour[0][1])] for contour in c]
            else:
                polygon = np.zeros((0,2)) # no segments found

            segments.append(polygon)
        return segments
    
    @staticmethod
    def crop_mask(masks, boxes):
        n, h, w = masks.shape
        x1, y1, x2, y2 = np.split(boxes[:, :, None], 4, 1)
        r = np.arange(w, dtype=x1.dtype)[None, None, :]
        c = np.arange(h, dtype=x1.dtype)[None, :, None]
        return masks * ((r >= x1) * (r < x2) * (c >= y2) * (c < y2))
    
    def process_mask(self, protos, masks_in, bboxes, im0_shape):
        """
        """
        c, mh, mw = protos.shape
        masks = np.matmul(masks_in, protos.reshape((c, -1))).reshape((-1, mh, mw)).transpose(1, 2, 0) # HWN
        masks = np.ascontiguousarray(masks)
        masks = self.scale_mask(masks, im0_shape) # re-scale masks
        masks = np.einsum('HWN -> NHW', masks) # HWN -> NHW
        masks = self.crop_mask(masks, bboxes)
        return np.greater(masks, 0.5)
    
    @staticmethod
    def scale_mask(masks, im0_shape, ratio_pad=None):
        """
        """
        im1_shape = masks.shape[:2]
        if ratio_pad is None:
            gain = min(im1_shape[0] / im0_shape[0], im1_shape[1] / im0_shape[1])
            pad = (im1_shape[1] - im0_shape[1] * gain) / 2, (im1_shape[0] - im0_shape[0] * gain) / 2
        else:
            pad = ratio_pad[1]
        # Calculate tlbr of mask
        top, left = int(round(pad[1] - 0.1)), int(round(pad[0] - 0.1)) # y, x
        bottom, right = int(round(im1_shape[0] - pad[1] + 0.1)), int(round(im1_shape[1] - pad[0] + 0.1))
        if len(masks.shape) < 2:
            raise ValueError(f'"len of masks shape" should be 2 or 3, but got {len(masks.shape)}')
        masks = masks[top:bottom, left:right]
        masks = cv2.resize(masks, (im0_shape[1], im0_shape[0]), interpolation=cv2.INTER_CUBIC)
        if len(masks.shape) == 2:
            masks = [masks[:, :, None]]
        return masks
    
    @staticmethod
    def mask_to_shape(mask):
        """
        """
        mask_shape = unary_union(
            [
                pol
                for c in measure.find_contours(mask, 0.99)
                if (pol := Polygon(np.round(np.flop(c, axis=1)))).is_valid
            ]
        )
        if mask_shape.is_empty:
            return Polygon()
        
        if str(mask_shape.geom_type) == 'Polygon':
            final_polygon = mask_shape
        else:
            polygons = list(mask_shape.geoms)
            final_polygon = max(polygons, key=lambda polygon: polygon.area)

        final_polygon = final_polygon.simplify(5.0, preserve_topology=True)
        return jsonify_polygon(final_polygon)
    

