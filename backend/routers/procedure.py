from fastapi import APIRouter, HTTPException
import requests
from pydantic import BaseModel

router = APIRouter()

# Pydantic model for user input
class UserQuery(BaseModel):
    question: str

# Hardcoded procedure data
procedures_data = {
    "procedures_etudiant": [
        {
            "titre": "Inscription universitaire (nouvel étudiant)",
            "procedure": "L’inscription se fait généralement en ligne via le portail www.inscription.tn puis finalisée en présentiel dans l’établissement.",
            "documents_requis": [
                "Copie du Baccalauréat (recto-verso)",
                "Original du relevé de notes du bac",
                "4 photos d’identité récentes",
                "Extrait de naissance (récent, en français et arabe)",
                "Copie de la carte d’identité nationale (CIN)",
                "Fiche d’orientation (si concerné)",
                "Dossier médical (formulaire fourni par l’université)",
                "Reçu de paiement des frais d’inscription",
                "Enveloppes timbrées",
                "Assurance (parfois exigée)"
            ]
        },
        {
            "titre": "Réinscription (étudiants déjà inscrits)",
            "procedure": "Accéder à la plateforme de réinscription en ligne (si disponible), paiement des frais et validation auprès du service scolarité.",
            "documents_requis": [
                "Photocopie de la carte étudiant",
                "Paiement des frais de réinscription",
                "Relevé de notes de l’année précédente",
                "Enveloppes timbrées"
            ]
        },
        # (Continue with the rest of the procedures as they are...)
    ]
}

# Function to get hardcoded procedure data
def load_procedures():
    knowledge = ""
    for procedure in procedures_data["procedures_etudiant"]:
        titre = procedure["titre"]
        procedure_description = procedure["procedure"]
        documents = ", ".join(procedure["documents_requis"])
        knowledge += f"\nTitre: {titre}\nProcédure: {procedure_description}\nDocuments requis: {documents}\n---"
    return knowledge

# Endpoint to handle user queries
@router.post("/procedure")
async def chatbot_response(data: UserQuery):
    try:
        knowledge = load_procedures()

        # Create the prompt for the chatbot
        prompt = f"Tu es un assistant universitaire tunisien. Voici les données disponibles :\n{knowledge}\n\nRéponds en français à cette question :\n{data.question}"

        # Call the Ollama API to get the chatbot's response
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

        # Check the response and return
        if response.status_code == 200:
            chatbot_response = response.json().get('message', {}).get('content', 'Désolé, je n\'ai pas pu répondre.')
            return {"chatbot_response": chatbot_response}
        else:
            raise HTTPException(status_code=500, detail="Erreur lors de l'appel à Ollama")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
