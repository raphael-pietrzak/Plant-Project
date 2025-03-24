# Ce fichier est exécuté au démarrage de l'ESP32
import gc
import time

print("\n" + "="*40)
print("🌱 Smart Plant System - Démarrage 🌱")
print("="*40 + "\n")

# Attendre un peu pour assurer la stabilité au démarrage
time.sleep(1)

# Libérer la mémoire avant de démarrer
gc.collect()

# Lancer le programme principal
try:
    import main
    app = main.SmartPlant()
    app.run()
except Exception as e:
    print(f"Erreur de démarrage: {e}")
    # Boucle de sécurité en cas d'erreur critique
    # pour éviter les redémarrages en boucle
    while True:
        print("Erreur critique, redémarrez le système manuellement")
        time.sleep(60)

