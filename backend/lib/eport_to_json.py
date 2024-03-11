import json

def export_to_json(data):
    file_path = "data.json"
    with open(file_path, "w") as json_file:
        json.dump(data, json_file)

    print("Data exported to data.json")