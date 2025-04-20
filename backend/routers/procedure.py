from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
import requests

router = APIRouter()

# Pydantic model for user input
class UserQuery(BaseModel):
    question: str

# Load procedure data from the JSON file
def load_procedures():
    try:
        # Absolute path using the script directory, to avoid issues with working directory
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "procedure.json")  # Path relative to the script
        
        # Debugging output to make sure the file path is correct
        print(f"DEBUG: Looking for procedure.json at: {file_path}")
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Le fichier 'procedure.json' est introuvable à {file_path}.")

        with open(file_path, "r", encoding="utf-8") as f:
            procedures = json.load(f)

        if "procedures_etudiant" not in procedures:
            raise HTTPException(status_code=400, detail="Clé 'procedures_etudiant' manquante dans le fichier JSON.")

        knowledge = ""
        for p in procedures["procedures_etudiant"]:
            titre = p.get("titre", "Titre manquant")
            procedure = p.get("procedure", "Procédure manquante")
            documents = ", ".join(p.get("documents_requis", []))
            knowledge += f"\nTitre: {titre}\nProcédure: {procedure}\nDocuments requis: {documents}\n---"
        
        return knowledge

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Le fichier JSON est mal formé.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du chargement des procédures : {str(e)}")

# Endpoint to handle user queries
@router.post("/procedure")
async def chatbot_response(data: UserQuery):
    try:
        knowledge = load_procedures()

        prompt = (
            f"Tu es un assistant universitaire tunisien. Voici les données disponibles :\n{knowledge}\n\n"
            f"Réponds en français à cette question :\n{data.question}"
        )

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama2",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "stream": False
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Erreur de l'API Ollama")

        response_data = response.json()
        chatbot_content = response_data.get("message", {}).get("content")

        if not chatbot_content:
            raise HTTPException(status_code=500, detail="Réponse vide reçue de l'API Ollama.")

        return {"chatbot_response": chatbot_content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne : {str(e)}")
