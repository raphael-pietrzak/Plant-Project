import requests
import random

SERVER_URL = "http://192.0.0.2:3001/api/measurements"  # Remplace par l'IP correcte

data = {
    "humidity": random.randint(1, 100),
    "device_id": "ESP32_01",
    "temperature": random.randint(10, 30),
    "light": random.randint(400, 500)
}

try:
    response = requests.post(SERVER_URL, json=data, timeout=5)
    print("Réponse du serveur :", response.text)
except requests.exceptions.RequestException as e:
    print("Erreur :", e)
