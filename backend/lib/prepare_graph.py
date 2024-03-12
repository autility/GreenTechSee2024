from PIL import Image
from shapely.geometry import Polygon, mapping

def prepare_data_for_graph(rooms, buf, res):
    im0 = Image.open(buf)
    all_room_edges = [] 
    img_width, img_height = im0.size
    x_fact = res/img_width
    y_fact = res/img_height

    print(f'rooms type => {type(rooms)}')
    if type(rooms) == list:
        print(f'rooms[0] type => {type(rooms[0])}')
    for pts in rooms:
        # pts is a Polygon object, need to convert to points
        # print(pol)
        # mpd = mapping(pol)
        # pts = mpd['coordinates']
        j = 0
        room_pts = []
        # print(f'pts => {pts}')
        while j < len(pts)-1:
            # print(f'pts[j] => {pts[j]}')
            if (pts[j] == pts[j+1]):
                pass
            else:
                first_point = (int(pts[j][0]*x_fact), int(pts[j][1]*y_fact))
                next_point = (int(pts[j+1][0]*x_fact), int(pts[j+1][1]*y_fact))
                room_pts.append((first_point, next_point))
            j += 1
        all_room_edges.append(room_pts)

    return all_room_edges
