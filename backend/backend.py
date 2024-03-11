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
from generate_planar_graph import generate_graph

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
    
main()
