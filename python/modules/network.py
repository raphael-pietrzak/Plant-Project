import python.modules.network as network
import urequests
import ujson
import time

class NetworkManager:
    """
    Classe pour gérer les connexions réseau et communiquer avec un serveur
    en utilisant MicroPython.
    """
    
    def __init__(self, ssid=None, password=None, server_url=None):
        """
        Initialise le gestionnaire réseau.
        
        Args:
            ssid (str): Nom du réseau WiFi
            password (str): Mot de passe du réseau WiFi
            server_url (str): URL du serveur distant
        """
        self.ssid = ssid
        self.password = password
        self.server_url = server_url
        self.wlan = network.WLAN(network.STA_IF)
        self.is_connected = False
    
    def connect_wifi(self, max_retries=5, retry_delay=2):
        """
        Se connecte au réseau WiFi.
        
        Args:
            max_retries (int): Nombre maximal de tentatives de connexion
            retry_delay (int): Délai entre les tentatives en secondes
            
        Returns:
            bool: True si la connexion a réussi, False sinon
        """
        if not self.ssid or not self.password:
            print("SSID et mot de passe requis")
            return False
        
        if not self.wlan.active():
            self.wlan.active(True)
        
        if self.wlan.isconnected():
            self.is_connected = True
            print(f"Déjà connecté à {self.ssid}")
            print(f"Adresse IP: {self.wlan.ifconfig()[0]}")
            return True
        
        print(f"Connexion au réseau {self.ssid}...")
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
    
    def disconnect_wifi(self):
        """
        Déconnecte du réseau WiFi.
        """
        if self.wlan.active():
            self.wlan.disconnect()
            self.wlan.active(False)
            self.is_connected = False
            print("Déconnecté du WiFi")
    
    def send_data(self, data, endpoint=None, method="POST"):
        """
        Envoie des données au serveur.
        
        Args:
            data (dict): Données à envoyer au format dictionnaire
            endpoint (str): Point d'accès spécifique (ajouté à server_url)
            method (str): Méthode HTTP ("GET", "POST", "PUT", etc.)
            
        Returns:
            dict: Réponse du serveur ou message d'erreur
        """
        if not self.is_connected:
            success = self.connect_wifi()
            if not success:
                return {"error": "Non connecté au WiFi"}
        
        if not self.server_url:
            return {"error": "URL du serveur non définie"}
        
        url = self.server_url
        if endpoint:
            url = url + endpoint if url.endswith('/') else url + '/' + endpoint
        
        try:
            # Conversion des données en JSON
            json_data = ujson.dumps(data)
            
            # Configuration des en-têtes
            headers = {
                'Content-Type': 'application/json',
            }
            
            # Envoi de la requête
            print(f"Envoi de données à {url} via {method}...")
            
            if method.upper() == "GET":
                response = urequests.get(url, headers=headers)
            elif method.upper() == "POST":
                response = urequests.post(url, headers=headers, data=json_data)
            elif method.upper() == "PUT":
                response = urequests.put(url, headers=headers, data=json_data)
            else:
                return {"error": f"Méthode HTTP non supportée: {method}"}
            
            # Traitement de la réponse
            status_code = response.status_code
            try:
                response_data = response.json()
            except:
                response_data = {"message": response.text}
            
            response.close()
            
            return {
                "status_code": status_code,
                "data": response_data
            }
            
        except Exception as e:
            return {"error": f"Erreur lors de l'envoi des données: {str(e)}"}
    
    def get_data(self, endpoint=None):
        """
        Récupère des données depuis le serveur.
        
        Args:
            endpoint (str): Point d'accès spécifique
            
        Returns:
            dict: Données reçues ou message d'erreur
        """
        return self.send_data({}, endpoint, "GET")
    
    def check_connection(self):
        """
        Vérifie l'état de la connexion.
        
        Returns:
            dict: État de la connexion avec détails
        """
        if not self.wlan.active():
            return {"connected": False, "message": "Interface WiFi inactive"}
        
        if not self.wlan.isconnected():
            return {"connected": False, "message": "Non connecté au réseau"}
        
        # Récupération des informations de connexion
        ip, subnet, gateway, dns = self.wlan.ifconfig()
        rssi = self.wlan.status('rssi') if hasattr(self.wlan, 'status') else 'N/A'
        
        return {
            "connected": True,
            "ssid": self.ssid,
            "ip": ip,
            "subnet": subnet,
            "gateway": gateway,
            "dns": dns,
            "signal_strength": rssi
        }