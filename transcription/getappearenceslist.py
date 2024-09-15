import json
import random

# Cargar el archivo JSON
with open("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/appearances/speaker_times.json", "r") as json_file:
    speaker_times = json.load(json_file)

# Función para seleccionar un tiempo de la lista de un speaker
def seleccionar_tiempo(speaker, metodo="random"):
    if speaker not in speaker_times:
        print(f"Speaker {speaker} no encontrado.")
        return None
    
    tiempos = speaker_times[speaker]
    
    if metodo == "random":
        # Seleccionar un tiempo aleatorio de la lista
        return random.choice(tiempos)
    elif metodo == "primero":
        # Seleccionar el primer tiempo de la lista
        return tiempos[0]
    elif metodo == "ultimo":
        # Seleccionar el último tiempo de la lista
        return tiempos[-1]
    else:
        print("Método de selección no válido. Usa 'random', 'primero' o 'ultimo'.")
        return None


