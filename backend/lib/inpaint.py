import cv2
from shapely.geometry import Polygon
import numpy as np


def inpaint_click(img, point):
    flood_mask = np.zeros((img.shape[0] + 2, img.shape[1] + 2), dtype=np.uint8)
    diff = (20,20,20)
    cv2.floodFill(img, flood_mask, (point[0], point[1]), (145,255,0), diff, diff, cv2.FLOODFILL_FIXED_RANGE)

    room_mask = flood_mask[1:-1, 1:-1]
    contours, _ = cv2.findContours(room_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    room_points = []
    for contour in contours:
        for point in contour:
            x, y = point[0] 
            room_points.append((x, y))

    room_polygon = Polygon(room_points)  
    room_polygon = room_polygon.simplify(5.0, preserve_topology=True) 
    return room_polygon
