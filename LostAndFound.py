import json
import requests

# Charger le fichier JSON contenant les procédures
with open("found.json", "r", encoding="utf-8") as f:
    objets_trouves= json.load(f)
with open("lost.json", "r", encoding="utf-8") as f:
    objets_perdus = json.load(f)
# Construire une base de connaissance sous forme de texte

#print(objets_trouves)
type=""
knowledge_trouves = ""
for objet in objets_trouves['objets_perdus_trouves']:
    description = objet["description"]
    email = objet["email"]
    localisation = objet["localisation"]
    knowledge_trouves += f"\nObjet trouvé : {description}\nLocalisation : {localisation['campus']} - {localisation['lieu']}\nContact : {email}\n---"

knowledge_perdus = ""
for objet in objets_perdus["objets_perdus"]:
    description = objet["description"]
    email = objet["email"]
    localisation = objet["localisation"]
    knowledge_perdus += f"\nObjet perdu : {description}\nLocalisation : {localisation['campus']} - {localisation['lieu']}\nContact : {email}\n---"
if type=="lost":
    knowledge=knowledge_perdus
else:
    knowledge=knowledge_trouves

# Boucle de chat
while True:
     description = input("👨‍🎓 Entrez la description de l'objet : ")
     email = input("📧 Entrez votre email : ")
     campus = input("🏫 Entrez le campus où l'objet a été trouvé ou perdu : ")
     lieu = input("📍 Entrez le lieu spécifique dans le campus : ")

    # Créer un dictionnaire avec les informations saisies
     objet = {
        "description": description,
        "email": email,
        "localisation": {
            "campus": campus,
            "lieu": lieu
         }
     }
     """if user_input.lower() in ["exit", "quit"]:
        break"""

    # Créer le prompt avec les données de connaissance et la question de l'utilisateur
     prompt = f" \nRéponds en français à cette question :\n Voici les objets trouvés et perdus :\n{knowledge}\nLe but est de faire correspondre l'input de l'utilisateur \n{objet}\n\avec les objets trouvés ou perdus, et de donner une réponse en fonction de cette correspondance qui comporte tous les données connues à propos de l'objet identifié."

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