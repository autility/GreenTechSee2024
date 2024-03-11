#!/usr/bin/python3

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

from lib.generate_planar_graph import generate_graph
from lib.YOLOv8 import *
from lib.convert_to_three import *
from lib.eport_to_json import *
from lib.prepare_graph import *

app = Flask(__name__)

def main():
    serve(app, host="0.0.0.0", port=8080)

@app.route("/")
def root():
    """
    Site main page handler function.
    :return: Content of index.html file
    """
    with open("index.html") as file:
        return file.read()
    
@app.route("/detect", methods=['POST'])
def detect():
    """
        Handler of /detect POST endpoint
        Receives uploaded file with a name "image_file", passes it
        through YOLOv8 object detection network nad returns and array
        of bounding boxes
    """
    buf = request.files['image_file']
    model = YOLOv8Seg()
    boxes, rooms, _ = model(buf.stream)
    for room in rooms:
        if type(room) is not list:
            rooms.remove(room)
    
    graph_data = prepare_data_for_graph(rooms, buf.stream, 512)
    graph = generate_graph(graph_data)
    json_data = convert_to_three(graph)
    export_to_json(json_data)

    return jsonify(rooms)

yolo_classes = ["room"]

main()
