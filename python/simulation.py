import requests
import json
import time
import random
import argparse
from datetime import datetime

# Configuration par défaut
DEFAULT_SERVER_URL = "http://localhost:3001/api/measurements"
DEFAULT_INTERVAL = 30  # secondes

def generate_sensor_data(device_id):
    # Générer des données aléatoires compatibles avec le modèle du serveur
    return {
        "device_id": device_id,
        "temperature": round(random.uniform(20.0, 30.0), 1),
        "humidity": round(random.uniform(60.0, 80.0), 1)
    }

def simulate_device(server_url, device_id, interval, verbose=True):
    print(f"=== Démarrage de la simulation pour l'appareil {device_id} ===")
    print(f"Envoi de données vers {server_url} toutes les {interval} secondes")
    
    try:
        while True:
            data = generate_sensor_data(device_id)
            try:
                if verbose:
                    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Envoi de données:")
                    print(f"  Device ID: {data['device_id']}")
                    print(f"  Température: {data['temperature']} °C")
                    print(f"  Humidité: {data['humidity']} %")
                
                response = requests.post(server_url, json=data)
                
                if verbose:
                    if response.status_code == 201:
                        print(f"  ✅ Succès (code {response.status_code})")
                    else:
                        print(f"  ❌ Échec (code {response.status_code}): {response.text}")
            except Exception as e:
                print(f"  ❌ Erreur de connexion: {e}")
            
            # Attendre avant le prochain envoi
            time.sleep(interval)
    except KeyboardInterrupt:
        print(f"\n=== Arrêt de la simulation pour l'appareil {device_id} ===")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simulation d'un appareil IoT pour plantes")
    parser.add_argument("--url", type=str, default=DEFAULT_SERVER_URL, 
                        help=f"URL du serveur (défaut: {DEFAULT_SERVER_URL})")
    parser.add_argument("--device", type=str, default="ESP8266_SIM",
                        help="ID de l'appareil à simuler (défaut: ESP8266_SIM)")
    parser.add_argument("--interval", type=int, default=DEFAULT_INTERVAL,
                        help=f"Intervalle entre les envois en secondes (défaut: {DEFAULT_INTERVAL})")
    parser.add_argument("--quiet", action="store_true",
                        help="Mode silencieux (moins de logs)")
    
    args = parser.parse_args()
    
    simulate_device(args.url, args.device, args.interval, verbose=not args.quiet)