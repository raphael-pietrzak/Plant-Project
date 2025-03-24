
# Configuration Wi-Fi
WIFI_SSID = "iPhone de Raphael"
WIFI_PASSWORD = "7652314326"
WIFI_USERNAME = None  # Pour WPA2-Enterprise, sinon None

# Configuration du serveur
SERVER_URL = "http://192.0.0.2:3001/api"
DEVICE_ID = "ESP32_PLANT"

# Pins des capteurs et actuateurs
TEMPERATURE_PIN = 32  # ADC
HUMIDITY_PIN = 33     # ADC
LIGHT_PIN = 34        # ADC
PUMP_PIN = 13         # Digital

# Seuils pour les actions automatiques
HUMIDITY_THRESHOLD = 30  # % en dessous duquel la plante est considérée comme "sèche"
TEMPERATURE_THRESHOLD = 30  # °C au-dessus duquel la plante a "chaud"
LIGHT_THRESHOLD = 20  # % en dessous duquel il fait "sombre"

# Configuration de l'arrosage
WATERING_DURATION = 3  # secondes d'arrosage quand la plante est sèche

# Intervalles
READING_INTERVAL = 5    # secondes entre chaque lecture des capteurs
REPORTING_INTERVAL = 30  # secondes entre chaque envoi au serveur
