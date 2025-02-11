import network
import camera
import urequests
import time

# Configuration WiFi
WIFI_SSID = 'Iphone de Raphael'
WIFI_PASSWORD = '7652314326'

# Configuration serveur
SERVER_URL = 'http://localhost:3000/upload'

def connect_wifi():
    station = network.WLAN(network.STA_IF)
    station.active(True)
    station.connect(WIFI_SSID, WIFI_PASSWORD)
    
    while not station.isconnected():
        time.sleep(1)
    print('Connexion WiFi établie')

def capture_and_send_photo():
    # Initialiser la caméra
    camera.init(0, format=camera.JPEG)
    
    # Capturer l'image
    buf = camera.capture()
    
    # Envoyer l'image au serveur
    try:
        response = urequests.post(
            SERVER_URL, 
            files={'image': ('photo.jpg', buf, 'image/jpeg')}
        )
        print('Photo envoyée avec succès')
        response.close()
    except Exception as e:
        print('Erreur lors de l\'envoi:', e)
    
    # Libérer les ressources
    camera.deinit()

# Connexion et envoi
connect_wifi()
capture_and_send_photo()