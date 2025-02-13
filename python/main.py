from modules.humidity import HumiditySensor
from modules.light import LightSensor
from modules.temperature import TemperatureSensor
from modules.pump import PumpRelay

class Main:
    def __init__(self):

        # init
        self.humidity = HumiditySensor(4)
        self.light = LightSensor(35)
        self.temp = TemperatureSensor(34)
        self.pump = PumpRelay(2)
    
    def run(self):

        # lecture des valeurs
        self.hum_value = self.humidity.read()  # Get humidity percentage
        self.light_value = self.light.read()   # Get light percentage
        self.temp_value = self.temp.read()     # Get temperature in Celsius

        print("Humidity: {}%".format(self.hum_value))
        print("Light: {}%".format(self.light_value))
        print("Temperature: {}°C".format(self.temp_value))

        # run
        if self.humidity.is_dry():
            self.pump.run_for(5)  # Pompe ON si la plante manque d'eau

        # Test de la pompe
        self.pump.turn_on()
        self.time.sleep(2)
        self.pump.turn_off()





if __name__ == "__main__":
    main = Main()
    main.run()