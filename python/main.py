import time
from machine import Pin, ADC

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


class HumiditySensor:
    def __init__(self, pin):
        """Initialise le capteur d'humidité sur le bon pin"""
        self.sensor = ADC(Pin(pin))
        self.sensor.atten(ADC.ATTN_11DB)  # Full range: 3.3v
        
    def read(self):
        """Renvoie l'humidité (0-100%)"""
        raw = self.sensor.read()
        # Convertit la valeur brute ADC (0-4095) en pourcentage (0-100)
        humidity = ((raw / 4095) * 100)
        return round(humidity, 2)
    
    def is_dry(self, threshold=30):
        """Renvoie True si l'humidité est faible (en dessous du seuil)"""
        return self.read() < threshold

class LightSensor:
    def __init__(self, pin):
        """Initialise le capteur de lumière sur le bon pin"""
        self.sensor = ADC(Pin(pin))
        self.sensor.atten(ADC.ATTN_11DB)  # Full range: 3.3v
        
    def read(self):
        """Renvoie la lumière (0-100%)"""
        raw = self.sensor.read()
        # Convert raw ADC value (0-4095) to percentage (0-100)
        light = ((raw / 4095) * 100)
        return round(light, 2)
    
    def is_dark(self, threshold=20):
        """Renvoie True si la lumière est faible (en dessous du seuil)"""
        return self.read() < threshold

class TemperatureSensor:
    def __init__(self, pin):
        """Initialise le capteur de température sur le bon pin"""
        self.sensor = ADC(Pin(pin))
        self.sensor.atten(ADC.ATTN_11DB)  # Full range: 3.3v
        
    def read(self):
        """Renvoie la température en Celsius"""
        raw = self.sensor.read()
        # Convertit la valeur brute ADC (0-4095) en tension (0-3.3v)
        voltage = (raw / 4095) * 3.3
        # Convertit la tension en température (Il faudra l'ajuster pour que ça marche bien)
        temperature = (voltage - 0.5) * 100
        return round(temperature, 2)
    
    def is_hot(self, threshold=30):
        """Renovie True si la température est élevée (au-dessus du seuil)"""
        return self.read() > threshold

class PumpRelay:
    def __init__(self, pin):
        """Initialise la pompe sur le bon pin"""
        self.relay = Pin(pin, Pin.OUT)
        self.is_running = False
        
    def turn_on(self):
        """Allume la pompe"""
        self.relay.on()
        self.is_running = True
        
    def turn_off(self):
        """Eteint la pompe"""
        self.relay.off()
        self.is_running = False
        
    def run_for(self, seconds):
        """Allume la pompe pour un certain nombre de secondes"""
        self.turn_on()
        time.sleep(seconds)
        self.turn_off()

if __name__ == "__main__":
    main = Main()
    main.run()