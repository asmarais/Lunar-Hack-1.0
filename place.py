import networkx as nx
from math import radians, cos, sin, asin, sqrt
import json
from rapidfuzz import process

# Étape 1 : Charger les lieux
def load_locations(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

# Étape 2 : Calcul de la distance entre deux points
def haversine(coord1, coord2):
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    return 6371 * c

# Étape 3 : Construire un graphe des lieux
def build_graph(locations):
    G = nx.Graph()
    for loc in locations:
        G.add_node(loc['title'], pos=(loc['location']['lng'], loc['location']['lat']))
    for i in range(len(locations)):
        for j in range(i + 1, len(locations)):
            loc1 = locations[i]
            loc2 = locations[j]
            dist = haversine(
                (loc1["location"]["lng"], loc1["location"]["lat"]),
                (loc2["location"]["lng"], loc2["location"]["lat"])
            )
            if dist < 0.2:
                G.add_edge(loc1['title'], loc2['title'], weight=dist)
    return G

# Étape 4 : Correspondance intelligente de text
def match_location(user_input, location_names):
    best_match, score, _ = process.extractOne(user_input, location_names)
    print(score)
    if score > 60:
        return best_match
    return None

# Étape 5 : Calcul du chemin le plus court
def show_shortest_path(G, start, end):
    if start not in G or end not in G:
        print("❌ Lieu introuvable.")
        return
    try:
        path = nx.shortest_path(G, source=start, target=end, weight='weight')
        total_distance = nx.shortest_path_length(G, source=start, target=end, weight='weight')
        
        print(f"\n🚶 Chemin le plus court de '{start}' à '{end}':")
        for step in path:
            print(f"➡ {step}")
        
        print(f"\n📏 Distance totale: {total_distance:.2f} km")
    except nx.NetworkXNoPath:
        print("❌ Aucun chemin trouvé entre les deux lieux.")


# Étape 6 : Partie interactive
locations = load_locations('locations.json')
G = build_graph(locations)
location_titles = [loc['title'] for loc in locations]

# Input pour la  destination
user_input = input("🧭 Où voulez-vous aller ? ").strip()
matched_place = match_location(user_input, location_titles)

# Input pour le starting point
start_input = input("🚩 D'où partez-vous ? (laisser vide pour 'Entrée principale') ").strip()
matched_start = match_location(start_input, location_titles) if start_input else "Entrée principale"

if matched_place:
    show_shortest_path(G, matched_start, matched_place)
else:
    print("❌ Aucun lieu correspondant trouvé.")
