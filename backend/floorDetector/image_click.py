import base64
from flask import request, Flask, jsonify
from waitress import serve
import cv2
import numpy as np
from shapely.geometry import Polygon


app = Flask(__name__)

def main():
    serve(app, host='0.0.0.0', port=8080)

@app.route("/")
def root():
    """
    Site main page handler function.
    :return: Content of index.html file
    """
    with open("index.html") as file:
        return file.read()
    
@app.route('/handle_click', methods=['POST'])
def handle_click():
    data = request.json
    imageDataURL = data['imageDataURL']
    x = data['x']
    y = data['y']
    base64_str = imageDataURL.split(',')[1]
    image_data = base64.b64decode(base64_str)
    # Convert the image data to a numpy array
    nparr = np.frombuffer(image_data, np.uint8)
    # Decode the image using OpenCV
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    room_polygon = inpaint_click(img, [x,y])
    coordinates = list(room_polygon.exterior.coords)
    return jsonify({"coordinates": coordinates})

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




if __name__ == "__main__":
    app.run(debug=True)