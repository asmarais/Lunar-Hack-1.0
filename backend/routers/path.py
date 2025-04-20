# pathfinder.py
import os
import json
import re
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import networkx as nx
from math import radians, cos, sin, asin, sqrt
from rapidfuzz import process

router = APIRouter()

# Request model
class PathRequest(BaseModel):
    query: str

# Global variables
locations = []
G = nx.Graph()

@router.on_event("startup")
def load_data():
    global locations, G
    try:
        # Get the absolute path to the current directory
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, 'locations.json')

        with open(file_path, 'r', encoding='utf-8') as file:
            locations = json.load(file)

        G = build_graph(locations)
        print("✅ locations.json loaded successfully.")
    except FileNotFoundError:
        print(f"❌ locations.json not found at path: {file_path}")
        locations = []
        G = nx.Graph()
    except Exception as e:
        print(f"❌ Error loading data: {str(e)}")
        locations = []
        G = nx.Graph()

def haversine(coord1, coord2):
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    return 6371 * c

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

def match_location(user_input, location_names):
    best_match, score, _ = process.extractOne(user_input, location_names)
    return best_match if score > 60 else None

def show_shortest_path(G, start, end):
    if start not in G or end not in G:
        return "❌ Lieu introuvable."
    try:
        path = nx.shortest_path(G, source=start, target=end, weight='weight')
        total_distance = nx.shortest_path_length(G, source=start, target=end, weight='weight')
        start_loc = G.nodes[start]['pos']
        end_loc = G.nodes[end]['pos']
        maps_url = f"https://www.google.com/maps/dir/{start_loc[1]},{start_loc[0]}/{end_loc[1]},{end_loc[0]}"
        response = f"\n🚶 Chemin le plus court de '{start}' à '{end}':\n"
        for step in path:
            response += f"➡ {step}\n"
        response += f"\n📏 Distance totale : {total_distance:.2f} km"
        response += f"\n🌍 Voir sur Google Maps : {maps_url}"
        return response
    except nx.NetworkXNoPath:
        return "❌ Aucun chemin trouvé entre les deux lieux."

@router.post("/path")
async def find_path(data: PathRequest):
    try:
        location_titles = [loc['title'] for loc in locations]

        prompt = f"""Tu es un assistant universitaire intelligent.

Voici une liste de lieux officiels du campus :
{', '.join(location_titles)}

Tu dois extraire deux lieux : le **lieu de départ** et le **lieu d’arrivée** de la phrase utilisateur.

⚠️ Important : tu dois obligatoirement faire correspondre les deux lieux à ceux de la liste ci-dessus.
N'utilise **aucun autre nom de lieu** que ceux présents dans la liste. Si un lieu n'est pas identifiable, considère par défaut 'Entrée Principale'.

Voici quelques exemples :
- Phrase : 'je veux aller de la bibliothèque au département informatique' → `de Bibliothèque à Département Informatique`
- Phrase : 'comment aller au bloc TP' → `de Entrée Principale à Bloc TP`

Phrase utilisateur : '{data.query}'

🧾 Réponds uniquement au format : `de <lieu de départ> à <lieu d'arrivée>`"""

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama2",
                "messages": [{"role": "user", "content": prompt}],
                "stream": False
            }
        )

        if response.status_code == 200:
            content = response.json().get("message", {}).get("content", "")
            match = re.search(r"de\s+(.+?)\s+(?:à|au)\s+(.+)", content, re.IGNORECASE)
            if match:
                start_input = match.group(1).strip()
                end_input = match.group(2).strip()
                matched_start = match_location(start_input, location_titles) or "Entrée Principale"
                matched_end = match_location(end_input, location_titles) or "Entrée Principale"
                path_response = show_shortest_path(G, matched_start, matched_end)
                return {"result": path_response}
            else:
                return {"result": f"❌ Je n'ai pas compris la demande. Réponse : {content}"}
        else:
            raise HTTPException(status_code=500, detail="Erreur de communication avec le serveur Llama2.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")
