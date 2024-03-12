from PIL import Image

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
        j = 0
        room_pts = []
        while j < len(pts)-1:
            if (pts[j] == pts[j+1]):
                pass
            else:
                first_point = (int(pts[j][0]*x_fact), int(pts[j][1]*y_fact))
                next_point = (int(pts[j+1][0]*x_fact), int(pts[j+1][1]*y_fact))
                room_pts.append((first_point, next_point))
            j += 1
        all_room_edges.append(room_pts)

    return all_room_edges
