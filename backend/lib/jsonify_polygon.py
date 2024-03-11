def jsonify_polygon(polygon):
    coords = list(polygon.exterior.coords)
    jsonify_coords = []
    for coord in coords:
        jsonify_coords.append([int(coord[0]), int(coord[1])])

    return jsonify_coords
