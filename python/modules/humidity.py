from machine import Pin, ADC

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
