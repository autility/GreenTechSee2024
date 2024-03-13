def convert_to_three(graph):
    values = []
    edges = []
    nodes = list(graph.keys())
    for node in nodes:
        value = [node[0], 0, node[1]]
        values.append(value)

    for c, connections in graph.items():
        for other_c in connections:
            edge = [nodes.index(c), nodes.index(other_c)]
            edges.append(edge)

    json_data = {
        "edges": edges,
        "nodes": values
    }

    return json_data
