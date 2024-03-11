def convert_to_three(graph):
    values = []
    for node, data in graph.nodes(data=True):
        value = [data['value'][0]/10, 0, data['value'][1]/10]
        values.append(value)

    json_data = {
        "edges": list(graph.edges()),
        "nodes": values
    }
