import requests
import json
import time
import random
import threading
from datetime import datetime

# Configuration
SERVER_URL = "http://localhost:3001/api/measurements"
DEVICES = [
    {"id": "ESP8266_SALON", "interval": 30, "temp_range": (21, 25), "humid_range": (50, 60)},
    {"id": "ESP8266_CHAMBRE", "interval": 45, "temp_range": (19, 22), "humid_range": (55, 65)},
    {"id": "ESP8266_CUISINE", "interval": 60, "temp_range": (22, 27), "humid_range": (60, 75)}
]

def generate_sensor_data(device_config):
    # Générer des données aléatoires avec les plages spécifiées
    temp_min, temp_max = device_config["temp_range"]
    humid_min, humid_max = device_config["humid_range"]
    
    return {
        "device_id": device_config["id"],
        "temperature": round(random.uniform(temp_min, temp_max), 1),
        "humidity": round(random.uniform(humid_min, humid_max), 1)
    }

def run_device_simulation(device_config):
    device_id = device_config["id"]
    interval = device_config["interval"]
    
    print(f"[{device_id}] Démarrage de la simulation (intervalle: {interval}s)")
    
    while True:
        data = generate_sensor_data(device_config)
        try:
            now = datetime.now().strftime('%H:%M:%S')
            print(f"[{now}] [{device_id}] T: {data['temperature']}°C, H: {data['humidity']}%")
            
            response = requests.post(SERVER_URL, json=data)
            
            if response.status_code != 201:
                print(f"[{device_id}] Erreur: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[{device_id}] Erreur de connexion: {e}")
        
        time.sleep(interval)

if __name__ == "__main__":
    print("=== Démarrage de la simulation multi-appareils ===")
    print(f"Serveur cible: {SERVER_URL}")
    print(f"Appareils configurés: {len(DEVICES)}")
    
    # Créer un thread pour chaque appareil
    threads = []
    for device_config in DEVICES:
        thread = threading.Thread(
            target=run_device_simulation,
            args=(device_config,),
            daemon=True
        )
        threads.append(thread)
        thread.start()
    
    try:
        # Maintenir le programme principal en vie
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n=== Arrêt de la simulation ===")
