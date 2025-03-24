"""
Guide de configuration réseau pour le projet Plante IoT
"""

print("""
=== GUIDE DE CONFIGURATION RÉSEAU ===

Il semble que vous avez deux réseaux différents:
1. Réseau de l'ordinateur: 192.0.0.x
2. Réseau du partage de connexion iPhone: 172.20.10.x

Pour que l'ESP32 puisse communiquer avec votre serveur, vous devez:

OPTION 1 (RECOMMANDÉE): CONNECTER L'ORDINATEUR AU PARTAGE DE CONNEXION
----------------------------------------------------------------------
1. Connecter votre ordinateur au partage de connexion de votre iPhone
2. Vérifier l'adresse IP de votre ordinateur sur ce réseau (probablement 172.20.10.2)
3. Mettre à jour config.py avec:
   SERVER_URL = "http://172.20.10.2:3001/api"

OPTION 2: CONFIGURER UN ROUTEUR COMMUN
--------------------------------------
1. Connecter à la fois l'ESP32 et l'ordinateur au même réseau WiFi
2. Trouver l'adresse IP de l'ordinateur sur ce réseau
3. Mettre à jour config.py avec cette adresse

VÉRIFICATION DE L'ADRESSE IP DE L'ORDINATEUR
-------------------------------------------
- Sur macOS/Linux: ouvrir Terminal et taper 'ifconfig' ou 'ip addr'
- Sur Windows: ouvrir CMD et taper 'ipconfig'

Recherchez l'interface connectée à votre réseau et notez son adresse IP.

N'oubliez pas que:
- Les appareils sur des réseaux différents ne peuvent pas communiquer directement
- L'ESP32 doit être sur le même réseau que le serveur
- Le port 3001 doit être ouvert sur votre ordinateur
""")

import network
import time
from config import WIFI_SSID, WIFI_PASSWORD

def check_network():
    # Se connecter au WiFi
    wlan = network.WLAN(network.STA_IF)
    if not wlan.active():
        wlan.active(True)
    
    if not wlan.isconnected():
        print(f"Connexion au réseau {WIFI_SSID}...")
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
        for _ in range(20):
            if wlan.isconnected():
                break
            time.sleep(1)
            print(".", end="")
        print()
    
    if wlan.isconnected():
        ip, subnet, gateway, dns = wlan.ifconfig()
        print(f"\nCONFIGURATION ACTUELLE:")
        print(f"ESP32 connecté au réseau: {WIFI_SSID}")
        print(f"Adresse IP: {ip}")
        print(f"Passerelle: {gateway}")
        print(f"\nVotre serveur doit être accessible depuis le même réseau.")
        
        # Déterminer le type de réseau
        if ip.startswith("172.20.10."):
            print("\nVous êtes connecté au réseau du partage de connexion iPhone.")
            print("Assurez-vous que votre ordinateur est aussi connecté à ce réseau.")
            print("L'adresse IP de votre serveur est probablement 172.20.10.2.")
        elif ip.startswith("192.0.0."):
            print("\nVous êtes connecté au réseau 192.0.0.x.")
            print("L'adresse IP de votre serveur est probablement 192.0.0.2.")
        else:
            print("\nVous êtes connecté à un autre réseau.")
            print(f"L'adresse IP de votre serveur doit être sur le même réseau ({ip.rsplit('.', 1)[0]}.X).")
    else:
        print(f"Impossible de se connecter au réseau {WIFI_SSID}")

if __name__ == "__main__":
    check_network()
