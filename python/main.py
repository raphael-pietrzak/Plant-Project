
import network
import time


def connect_to_wifi(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    if not wlan.active():
        wlan.active(True)

    if not wlan.isconnected():
        print(f"Try connect to SSID : {ssid}")
        wlan.connect(ssid, password)

        while not wlan.isconnected():
            print('.', end = " ")
            time.sleep_ms(500)
    return wlan

def display_wifi_info(wlan):
    print("\nLocal IP: {}\nSubnet mask: {}\nIP Gateway: {}\nDNS:{}".format(*wlan.ifconfig()))
    print("BSSID: {:02x}:{:02x}:{:02x}:{:02x}:{:02x}:{:02x}".format(*wlan.config("mac")))
    print(f"RSSI: {wlan.status('rssi')} dB")

ssid = 'iPhone de Raphael'
password = '7652314326'

if __name__=="__main__":
    my_wlan = connect_to_wifi(ssid=ssid, password=password)
    display_wifi_info(my_wlan)