from modules.humidity import HumiditySensor
from modules.light import LightSensor
from modules.temperature import TemperatureSensor
from modules.pump import PumpRelay
from modules.network import NetworkManager

class Main:
    def __init__(self):
        # init
        self.humidity = HumiditySensor(4)
        self.light = LightSensor(35)
        self.temp = TemperatureSensor(34)
        self.pump = PumpRelay(2)

    def connect(self):
        network = NetworkManager(
            ssid="Iphone de Raphael", 
            password="7652314326", 
            server_url="http://192.0.0.2:3001/api"
        )

        # Connexion au WiFi
        network.connect_wifi()

        # Envoi de données
        data = {
            "temperature": 25.4,
            "humidity": 65,
            "device_id": "esp32_1"
        }
        response = network.send_data(data, endpoint="measurements")
        print(response)

        # Récupération de données
        status = network.get_data(endpoint="status")
        print(status)

        # Vérification de l'état de la connexion
        connection_info = network.check_connection()
        print(connection_info)

        # Déconnexion à la fin
        network.disconnect_wifi()
    
    def run(self):
        # Lecture des valeurs
        self.hum_value = self.humidity.read()  # Get humidity percentage
        self.light_value = self.light.read()   # Get light percentage
        self.temp_value = self.temp.read()     # Get temperature in Celsius

        print("Humidity: {}%".format(self.hum_value))
        print("Light: {}%".format(self.light_value))
        print("Temperature: {}°C".format(self.temp_value))

        # Run
        if self.humidity.is_dry():
            self.pump.run_for(5)  # Pompe ON si la plante manque d'eau

        # Test de la pompe
        self.pump.turn_on()
        self.time.sleep(2)
        self.pump.turn_off()

        self.connect()


if __name__ == "__main__":
    main = Main()
    main.run()