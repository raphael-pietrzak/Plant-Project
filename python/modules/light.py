from machine import Pin, ADC

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
