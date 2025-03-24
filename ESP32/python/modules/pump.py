import time
from machine import Pin

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
