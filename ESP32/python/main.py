import time
import ujson
import config
from machine import Pin
from modules.network import NetworkManager
from modules.temperature import TemperatureSensor
from modules.humidity import HumiditySensor
from modules.light import LightSensor
from modules.pump import PumpRelay

class Main:
    def __init__(self):
        """Initialisation de la classe principale"""
        # LED pour le retour visuel
        self.led = Pin(2, Pin.OUT)
        
        # Initialiser la connexion réseau
        self.network = NetworkManager(
            ssid=config.WIFI_SSID,
            password=config.WIFI_PASSWORD,
            server_url=config.SERVER_URL
        )
        
        # Initialiser les capteurs
        self.temp_sensor = TemperatureSensor(config.TEMPERATURE_PIN)
        self.humidity_sensor = HumiditySensor(config.HUMIDITY_PIN)
        self.light_sensor = LightSensor(config.LIGHT_PIN)
        self.pump = PumpRelay(config.PUMP_PIN)
    
    def connect(self):
        """Se connecter au réseau WiFi"""
        return self.network.connect_wifi()
    
    def read_sensors(self):
        """Lire les valeurs de tous les capteurs disponibles"""
        readings = {
            "device_id": config.DEVICE_ID,
            "temperature": self.temp_sensor.read(),
            "humidity": self.humidity_sensor.read(),
            "light": self.light_sensor.read()
        }
        
        print(f"=> Température: {readings['temperature']}°C")
        print(f"=> Humidité: {readings['humidity']}%")
        print(f"=> Lumière: {readings['light']}%")
        
        return readings
    
    def send_data(self, data):
        """Envoyer les données au serveur"""
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
    
    def water_if_needed(self):
        """Arroser si l'humidité est trop basse"""
        humidity = self.humidity_sensor.read()
        if humidity < config.HUMIDITY_THRESHOLD:
            print(f"==> Arrosage (humidité: {humidity}%)")
            self.pump.run_for(config.WATERING_DURATION)
            return True
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
        self.connect()
        
        print("\n-> Démarrage de la boucle principale\n")
        last_report_time = 0
        
        while True:
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

# Point d'entrée du programme
if __name__ == "__main__":
    main = Main()
    main.run()


