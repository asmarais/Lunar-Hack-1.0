from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import requests
import os

router = APIRouter()

class Localisation(BaseModel):
    campus: str
    lieu: str

class LostItem(BaseModel):
    description: str
    email: str
    localisation: Localisation

class ChatRequest(BaseModel):
    description: str
    email: str
    campus: str
    lieu: str
    type: str  # 'lost' or 'found'


def ensure_file(file_path, default_data):
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(default_data, f, ensure_ascii=False, indent=2)


def add_item(file_path, item_data, category):
    ensure_file(file_path, {"objets_perdus": []} if category == "lost" else {"objets_perdus_trouves": []})

    with open(file_path, "r+", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = {"objets_perdus": []} if category == "lost" else {"objets_perdus_trouves": []}

        if category == "lost":
            data["objets_perdus"].append(item_data)
        else:
            data["objets_perdus_trouves"].append(item_data)

        f.seek(0)
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.truncate()


@router.post("/lost")
async def addLost(data: LostItem):
    add_item("lost.json", data.dict(), "lost")
    return {"message": "Lost item added", "item": data}


def load_data():
    ensure_file("found.json", {"objets_perdus_trouves": []})
    ensure_file("lost.json", {"objets_perdus": []})

    with open("found.json", "r", encoding="utf-8") as f:
        objets_trouves = json.load(f)

    with open("lost.json", "r", encoding="utf-8") as f:
        objets_perdus = json.load(f)

    knowledge_trouves = ""
    for objet in objets_trouves.get('objets_perdus_trouves', []):
        localisation = objet.get("localisation", {})
        knowledge_trouves += (
            f"\nObjet trouvé : {objet.get('description')}"
            f"\nLocalisation : {localisation.get('campus')} - {localisation.get('lieu')}"
            f"\nContact : {objet.get('email')}\n---"
        )

    knowledge_perdus = ""
    for objet in objets_perdus.get('objets_perdus', []):
        localisation = objet.get("localisation", {})
        knowledge_perdus += (
            f"\nObjet perdu : {objet.get('description')}"
            f"\nLocalisation : {localisation.get('campus')} - {localisation.get('lieu')}"
            f"\nContact : {objet.get('email')}\n---"
        )

    return knowledge_trouves, knowledge_perdus


@router.post("/chatbot")
async def chatbot_response(data: ChatRequest):
    knowledge_trouves, knowledge_perdus = load_data()

    knowledge = knowledge_perdus if data.type == "lost" else knowledge_trouves

    objet = {
        "description": data.description,
        "email": data.email,
        "localisation": {
            "campus": data.campus,
            "lieu": data.lieu
        }
    }

    prompt = (
        f"\nRéponds en français à cette question :"
        f"\nVoici les objets trouvés et perdus :\n{knowledge}"
        f"\nLe but est de faire correspondre l'input de l'utilisateur \n{objet}"
        f"\navec les objets trouvés ou perdus, et de donner une réponse en fonction de cette correspondance "
        f"qui comporte tous les données connues à propos de l'objet identifié."
    )

    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama2",
                "messages": [{"role": "user", "content": prompt}],
                "stream": False
            },
            
        )

        if response.status_code == 200:
            return {"chatbot_response": response.json().get('message', {}).get('content', 'Réponse non disponible.')}
        else:
            raise HTTPException(status_code=500, detail="Erreur lors de l'appel à Ollama")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Erreur de connexion à Ollama: {str(e)}")
