import requests
import json
import time
import random
from datetime import datetime

# URL de votre serveur
SERVER_URL = "http://localhost:3001/api/plants"

def generate_sensor_data():
    # Générer des données aléatoires réalistes
    return {
        "device_id": "ESP8266_1",
        "timestamp": datetime.now().isoformat(),
        "temperature": round(random.uniform(20.0, 30.0), 1),
        "humidity": round(random.uniform(60.0, 80.0), 1),
        "light": round(random.uniform(200, 800)),
        "battery": round(random.uniform(3.0, 4.2), 2)
    }

def simulate_esp():
    while True:
        data = generate_sensor_data()
        try:
            response = requests.post(SERVER_URL, json=data)
            print(f"Données envoyées: {data}")
            print(f"Réponse: {response.status_code}")
        except Exception as e:
            print(f"Erreur: {e}")
        
        # Attendre 30 secondes avant le prochain envoi
        time.sleep(30)

if __name__ == "__main__":
    simulate_esp()