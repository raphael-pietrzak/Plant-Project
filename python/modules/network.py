import network
import time
import ubinascii
import machine

class NetworkManager:
    def __init__(self, ssid, password, server_url, username=None):
        """
        Initialise le gestionnaire de réseau avec les informations de connexion
        """

        self.ssid = ssid
        self.password = password
        self.username = username
        self.server_url = server_url
        self.wlan = network.WLAN(network.STA_IF)
        
        # Obtenir l'adresse MAC pour l'identification uniquie
        self.mac = ubinascii.hexlify(network.WLAN().config('mac'),':').decode()
        
        # Activer l'interface réseau
        self.wlan.active(True)

    def connect_wifi(self, max_retries=10):
        """
        Se connecte au réseau WiFi configuré
        """

        print(f"[RÉSEAU] Connexion au WiFi '{self.ssid}'...")
        
        if self.wlan.isconnected():
            print(f"[RÉSEAU] Déjà connecté au WiFi, IP: {self.get_ip()}")
            return True
            
        # Se connecter au réseau WiFi
        self.wlan.connect(self.ssid, self.password)
        
        # Attendre la connexion
        retry_count = 0
        while not self.wlan.isconnected():
            if retry_count >= max_retries:
                print("[RÉSEAU] Échec de connexion au WiFi après plusieurs tentatives")
                return False
                
            print(f"[RÉSEAU] Tentative de connexion ({retry_count+1}/{max_retries})...")
            time.sleep(1)
            retry_count += 1
        
        # Afficher les informations de connexion
        ip = self.get_ip()
        print(f"[RÉSEAU] Connexion WiFi établie! IP: {ip}")
        return True
    
    def get_ip(self):
        """
        Récupère l'adresse IP attribuée
        """
        if self.wlan.isconnected():
            return self.wlan.ifconfig()[0]
        else:
            return "Non connecté"
    
    def reconnect_if_needed(self):
        """
        Vérifie et rétablit la connexion si nécessaire
        """
        if not self.wlan.isconnected():
            print("[RÉSEAU] Connexion perdue, tentative de reconnexion...")
            return self.connect_wifi()
        return True
    
    def disconnect(self):
        """
        Déconnecte du réseau WiFi
        """
        if self.wlan.isconnected():
            self.wlan.disconnect()
            print("[RÉSEAU] Déconnecté du WiFi")
