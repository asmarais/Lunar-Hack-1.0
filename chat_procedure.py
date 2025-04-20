import json
import requests

# Charger le fichier JSON contenant les procédures
with open("procedure.json", "r", encoding="utf-8") as f:
    procedures = json.load(f)

# Construire une base de connaissance sous forme de texte
knowledge = ""
for p in procedures["procedures_etudiant"]:
    titre = p["titre"]
    print(titre)
    procedure = p["procedure"]
    documents = ", ".join(p["documents_requis"])
    knowledge += f"\nTitre: {titre}\nProcédure: {procedure}\nDocuments requis: {documents}\n---"

# Boucle de chat
while True:
    user_input = input("\n👨‍🎓 Toi : ")
    if user_input.lower() in ["exit", "quit"]:
        break

    # Créer le prompt avec les données de connaissance et la question de l'utilisateur
    prompt = f"Tu es un assistant universitaire tunisien. Voici les données disponibles :\n{knowledge}\n\nRéponds en français à cette question :\n{user_input}"

    # Appel à l'API Ollama pour obtenir la réponse
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

    # Vérifier la réponse et l'afficher
    if response.status_code == 200:
        chatbot_response = response.json().get('message', {}).get('content', 'Désolé, je n\'ai pas pu répondre.')
        print("\n🎓 Chatbot :", chatbot_response)
    else:
        print("❌ Erreur lors de l'appel à Ollama :", response.text)
