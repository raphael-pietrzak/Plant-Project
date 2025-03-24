from machine import Pin, ADC

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
        # temp capteur : 280
        # temp reelle : 21
        temperature = (voltage - 0.5) * 100
        return round(temperature, 2)
    
    def is_hot(self, threshold=30):
        """Renovie True si la température est élevée (au-dessus du seuil)"""
        return self.read() > threshold

