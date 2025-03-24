import network
import socket
import time
import urequests
from config import WIFI_SSID, WIFI_PASSWORD

def connect_wifi():
    print(f"Connexion au réseau Wi-Fi {WIFI_SSID}...")
    
    wlan = network.WLAN(network.STA_IF)
    if not wlan.active():
        wlan.active(True)
    
    if wlan.isconnected():
        print("Déjà connecté au Wi-Fi")
        print("Adresse IP:", wlan.ifconfig()[0])
        return wlan
    
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    
    max_wait = 20
    while max_wait > 0:
        if wlan.isconnected():
            print("Connecté au Wi-Fi!")
            print("Adresse IP:", wlan.ifconfig()[0])
            return wlan
        max_wait -= 1
        print("En attente de connexion...")
        time.sleep(1)
    
    print("Échec de la connexion au Wi-Fi")
    return None

def scan_network(wlan):
    """Scan le réseau pour trouver des adresses possibles pour le serveur"""
    ip, subnet, gateway, dns = wlan.ifconfig()
    
    # Calculer le réseau de base en fonction de l'IP et du masque de sous-réseau
    ip_parts = [int(p) for p in ip.split('.')]
    mask_parts = [int(p) for p in subnet.split('.')]
    
    network_base = [ip_parts[i] & mask_parts[i] for i in range(4)]
    
    print(f"Réseau local: {'.'.join(str(p) for p in network_base)}")
    print(f"Passerelle: {gateway}")
    
    # Tester la passerelle et quelques adresses courantes
    test_addresses = [
        gateway,
        "172.20.10.1",  # Adresse iPhone courante
        "192.168.1.1",  # Adresse de routeur courante
        "192.168.0.1",  # Autre adresse de routeur courante
        "192.168.43.1", # Point d'accès Android
        "10.0.0.1",     # Autre adresse réseau courante
    ]
    
    print("\nTest d'adresses courantes pour le serveur:")
    for addr in test_addresses:
        print(f"Test de {addr}:3001...", end=" ")
        try:
            response = urequests.get(f"http://{addr}:3001/api/preferences", timeout=2)
            print(f"SUCCESS! Code: {response.status_code}")
            
            if response.status_code == 200:
                print(f"✓✓✓ SERVEUR TROUVÉ À {addr}:3001! ✓✓✓")
                print(f"Réponse: {response.text}")
                response.close()
                return addr
            response.close()
        except Exception as e:
            print(f"Échec: {e}")
    
    return None

def scan_subnet(wlan, start=1, end=10):
    """Scan une partie du sous-réseau pour trouver le serveur"""
    ip, subnet, gateway, dns = wlan.ifconfig()
    base_ip = ip.rsplit('.', 1)[0] + '.'
    
    print(f"\nScan du sous-réseau {base_ip}x (de {start} à {end}):")
    for i in range(start, end + 1):
        addr = f"{base_ip}{i}"
        print(f"Test de {addr}:3001...", end=" ")
        try:
            response = urequests.get(f"http://{addr}:3001/api/preferences", timeout=1)
            print(f"SUCCESS! Code: {response.status_code}")
            
            if response.status_code == 200:
                print(f"✓✓✓ SERVEUR TROUVÉ À {addr}:3001! ✓✓✓")
                print(f"Réponse: {response.text}")
                response.close()
                return addr
            response.close()
        except Exception as e:
            print(f"Échec: {type(e).__name__}")
    
    return None

def main():
    wlan = connect_wifi()
    if not wlan:
        return
    
    print("\n--- DIAGNOSTIC RÉSEAU ---")
    ip, subnet, gateway, dns = wlan.ifconfig()
    print(f"Adresse IP: {ip}")
    print(f"Masque de sous-réseau: {subnet}")
    print(f"Passerelle: {gateway}")
    
    # Chercher le serveur parmi les adresses courantes
    server_addr = scan_network(wlan)
    
    # Si non trouvé, scanner une partie du sous-réseau
    if not server_addr:
        server_addr = scan_subnet(wlan, 1, 10)  # Tester les 10 premières adresses
    
    if server_addr:
        print("\n=== CONFIGURATION RECOMMANDÉE ===")
        print(f"Mettez à jour config.py avec l'adresse du serveur:")
        print(f"SERVER_URL = \"http://{server_addr}:3001/api\"")
    else:
        print("\n❌ Serveur non trouvé!")
        print("Assurez-vous que:")
        print("1. Le serveur est en cours d'exécution")
        print("2. Le serveur et l'ESP32 sont sur le même réseau")
        print("3. Le port 3001 est ouvert sur le serveur")

if __name__ == "__main__":
    main()
