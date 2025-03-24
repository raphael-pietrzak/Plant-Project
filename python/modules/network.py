import network
import time

class NetworkManager:
    def __init__(self, ssid=None, password=None, username=None, server_url=None):
        self.ssid = ssid
        self.password = password
        self.username = username  # Ajout du nom d'utilisateur
        self.server_url = server_url
        self.wlan = network.WLAN(network.STA_IF)
        self.is_connected = False
    
    def connect_wifi(self, max_retries=5, retry_delay=2):
        if not self.ssid or not self.password:
            print("SSID et mot de passe requis")
            return False
        
        if not self.wlan.active():
            self.wlan.active(True)
            time.sleep(1)  # Délai pour l'initialisation
        
        if self.wlan.isconnected():
            self.is_connected = True
            print(f"Déja connecté à {self.ssid}")
            print(f"Adresse IP: {self.wlan.ifconfig()[0]}")
            return True
        
        print(self.wlan.scan())
        
        print(f"Connexion au réseau {self.ssid}...")
        
        try:
            # Configuration pour WPA2-Enterprise avec identifiant
            if self.username:
                print(f"Utilisation de l'authentification WPA2-Enterprise avec l'utilisateur: {self.username}")
                self.wlan.config(authmode=network.AUTH_WPA2_ENTERPRISE)
                self.wlan.config(identity=self.username)
                self.wlan.config(password=self.password)
                self.wlan.connect(self.ssid)
            else:
                # Connexion WPA2-PSK standard
                self.wlan.connect(self.ssid, self.password)
            
            # Attendre la connexion avec des tentatives
            retry_count = 0
            while not self.wlan.isconnected() and retry_count < max_retries:
                retry_count += 1
                print(f"Tentative {retry_count}/{max_retries}...")
                time.sleep(retry_delay)
            
            if self.wlan.isconnected():
                self.is_connected = True
                print("Connecté!")
                print(f"Adresse IP: {self.wlan.ifconfig()[0]}")
                return True
            else:
                print("Échec de connexion au WiFi")
                return False
                
        except OSError as e:
            print(f"Erreur WiFi: {e}")
            self.wlan.active(False)
            time.sleep(2)
            self.wlan.active(True)
            return False
        
    def send_data(self, data, endpoint="data"):
        if not self.is_connected:
            print("Non connecté au réseau")
            return False
        
        if not self.server_url:
            print("URL du serveur requise")
            return False
        
        try:
            import urequests as requests
        except ImportError:
            print("urequests non disponible")
            return False
        
        try:
            response = requests.post(f"{self.server_url}/{endpoint}", json=data)
            return response.json()
        except OSError as e:
            print(f"Erreur de requête: {e}")
            return False
    
        