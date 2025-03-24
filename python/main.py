import time
import ujson
from machine import Pin

# Importation des modules nécessaires
try:
    import config
    from modules.network import NetworkManager
    from modules.temperature import TemperatureSensor
    from modules.humidity import HumiditySensor
    from modules.light import LightSensor
    from modules.pump import PumpRelay
except ImportError as e:
    print(f"Erreur d'importation: {e}")

class SmartPlant:
    def __init__(self):
        """Initialisation de la classe principale"""
        # LED pour le retour visuel
        self.led = Pin(2, Pin.OUT)
        
        # Initialiser la connexion réseau
        try:
            self.network = NetworkManager(
                ssid=config.WIFI_SSID,
                password=config.WIFI_PASSWORD,
                server_url=config.SERVER_URL
            )
            print("[O] Module réseau initialisé")
        except Exception as e:
            print(f"[X] Erreur d'initialisation du réseau: {e}")
            self.network = None
        
        # Initialiser les capteurs
        try:
            self.temp_sensor = TemperatureSensor(config.TEMPERATURE_PIN)
            print("[O] Capteur de température initialisé")
        except Exception as e:
            print(f"[X] Erreur d'initialisation du capteur de température: {e}")
            self.temp_sensor = None
            
        try:
            self.humidity_sensor = HumiditySensor(config.HUMIDITY_PIN)
            print("[O] Capteur d'humidité initialisé")
        except Exception as e:
            print(f"[X] Erreur d'initialisation du capteur d'humidité: {e}")
            self.humidity_sensor = None
            
        try:
            self.light_sensor = LightSensor(config.LIGHT_PIN)
            print("[O] Capteur de lumière initialisé")
        except Exception as e:
            print(f"[X] Erreur d'initialisation du capteur de lumière: {e}")
            self.light_sensor = None
            
        try:
            self.pump = PumpRelay(config.PUMP_PIN)
            print("[O] Pompe initialisée")
        except Exception as e:
            print(f"[X] Erreur d'initialisation de la pompe: {e}")
            self.pump = None
    
    def connect(self):
        """Se connecter au réseau WiFi"""
        if self.network:
            return self.network.connect_wifi()
        return False
    
    def read_sensors(self):
        """Lire les valeurs de tous les capteurs disponibles"""
        readings = {
            "device_id": config.DEVICE_ID,
        }
        
        # Lire la température
        if self.temp_sensor:
            try:
                readings["temperature"] = self.temp_sensor.read()
                print(f"=> Température: {readings['temperature']}°C")
            except Exception as e:
                print(f"[X] Erreur lecture température: {e}")
                readings["temperature"] = None
        
        # Lire l'humidité
        if self.humidity_sensor:
            try:
                readings["humidity"] = self.humidity_sensor.read()
                print(f"=> Humidité: {readings['humidity']}%")
            except Exception as e:
                print(f"[X] Erreur lecture humidité: {e}")
                readings["humidity"] = None
        
        # Lire la lumière
        if self.light_sensor:
            try:
                readings["light"] = self.light_sensor.read()
                print(f"=> Lumière: {readings['light']}%")
            except Exception as e:
                print(f"[X] Erreur lecture lumière: {e}")
                readings["light"] = None
        
        return readings
    
    def send_data(self, data):
        """Envoyer les données au serveur"""
        if not self.network:
            print("[X] Pas de connexion réseau disponible")
            return False
            
        try:
            import urequests
            headers = {"Content-Type": "application/json"}
            endpoint = f"{config.SERVER_URL}/measurements"
            json_data = ujson.dumps(data)
            
            print("!! Envoi des données:", json_data)
            
            response = urequests.post(endpoint, data=json_data, headers=headers)
            print(f"[O] Réponse du serveur ({response.status_code}):", response.text)
            response.close()
            self.blink_led(1)  # Clignoter une fois pour confirmer
            return True
        except Exception as e:
            print(f"[X] Erreur d'envoi: {e}")
            self.blink_led(3, 0.1)  # Clignoter 3 fois rapidement pour signaler une erreur
            return False
    
    def water_if_needed(self):
        """Arroser si l'humidité est trop basse"""
        if not self.humidity_sensor or not self.pump:
            return False
            
        try:
            humidity = self.humidity_sensor.read()
            if humidity < config.HUMIDITY_THRESHOLD:
                print(f"==> Arrosage (humidité: {humidity}%)")
                self.pump.run_for(config.WATERING_DURATION)
                return True
        except Exception as e:
            print(f"[X] Erreur lors de la vérification d'arrosage: {e}")
        
        return False
    
    def blink_led(self, times=1, delay=0.2):
        """Faire clignoter la LED"""
        for _ in range(times):
            self.led.on()
            time.sleep(delay)
            self.led.off()
            time.sleep(delay)
    
    def run(self):
        """Exécuter la boucle principale"""
        # Se connecter au WiFi
        if self.network:
            self.connect()
        
        print("\n-> Démarrage de la boucle principale\n")
        last_report_time = 0
        
        while True:
            try:
                # Lire les capteurs
                readings = self.read_sensors()
                
                # Vérifier s'il faut arroser
                self.water_if_needed()
                
                # Envoyer les données périodiquement
                current_time = time.time()
                if current_time - last_report_time >= config.REPORTING_INTERVAL:
                    if self.send_data(readings):
                        last_report_time = current_time
                
                # Attendre avant la prochaine lecture
                time.sleep(config.READING_INTERVAL)
                
            except Exception as e:
                print(f"[X] Erreur dans la boucle principale: {e}")
                time.sleep(5)  # Attendre avant de réessayer

# Point d'entrée du programme
if __name__ == "__main__":
    try:
        smart_plant = SmartPlant()
        smart_plant.run()
    except Exception as e:
        print(f"[X] Erreur critique: {e}")


