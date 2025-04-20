import json

LOST_FILE = 'objets_perdus.json'
FOUND_FILE = 'objets_perdus_trouves.json'

# Load data from file
def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# Save data to file
def save_data(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

# Add item
def add_item( new_item,type):
    if type=="lost":
        file_path=LOST_FILE
    else:
        file_path=FOUND_FILE
    data = load_data(file_path)
    data.append(new_item)
    save_data(file_path, data)
    print(f"[+] Item added to {file_path}")

# Delete item by index
'''def delete_item(file_path, index):
    data = load_data(file_path)
    if 0 <= index < len(data):
        removed = data.pop(index)
        save_data(file_path, data)
        print(f"[-] Deleted item: {removed['description']}")
    else:
        print("[!] Invalid index")'''

# Example usage
if __name__ == "__main__":
    # Example new object
    example_item = {
        "description": "Stylo plume noir avec capuchon doré.",
        "email": "etudiant7@etudient.utunis.tn",
        "localisation": { "lieu": "Bibliothèque" }
    }

    # Add to lost items
    add_item(LOST_FILE, 'objets_perdus', example_item)

    # Add to found items
    add_item(FOUND_FILE, 'objets_perdus_trouves', example_item)

    # Delete 1st item from lost items
    delete_item(LOST_FILE, 'objets_perdus', 0)

    # Delete 2nd item from found items
    delete_item(FOUND_FILE, 'objets_perdus_trouves', 1)
