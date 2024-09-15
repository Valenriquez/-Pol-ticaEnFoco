import pandas as pd
import json
import os

# Cargar los archivos
audio_tsv = pd.read_csv("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/audio.tsv", sep='\t')  # Archivo de transcripción
with open("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/appearances/speaker_times.json", "r") as json_file:
    speaker_times = json.load(json_file)  # Archivo de tiempos de los speakers

# Inicializar un diccionario para almacenar los diálogos por speaker
speaker_dialogues = {speaker: [] for speaker in speaker_times.keys()}

# Función para verificar si un diálogo pertenece al rango de tiempo de un speaker
def pertenece_a_speaker(start, end, tiempos_speaker):
    for tiempo in tiempos_speaker:
        rango_inicio, rango_fin = tiempo
        # Verificar si hay intersección entre los tiempos de la declaración y los del speaker
        if start <= rango_fin and end >= rango_inicio:
            return True
    return False

# Iterar sobre las filas del archivo de transcripción y asignar los diálogos a los speakers
for index, row in audio_tsv.iterrows():
    start_time = row['start'] / 1000  # Convertir milisegundos a segundos
    end_time = row['end'] / 1000
    dialogo = row['text']
    
    # Verificar a qué speaker pertenece el diálogo basado en el rango de tiempo
    for speaker, tiempos in speaker_times.items():
        if pertenece_a_speaker(start_time, end_time, tiempos):
            speaker_dialogues[speaker].append(dialogo)
            break  # Asumimos que el diálogo pertenece solo a un speaker, así que salimos del loop


# Crear la carpeta para guardar la clasificación de los diálogos
if not os.path.exists("speech-clasification"):
    os.makedirs("speech-clasification")

# Guardar los diálogos clasificados por speaker en un archivo JSON
with open("speech-clasification/speaker_dialogues.json", "w") as json_file:
    json.dump(speaker_dialogues, json_file, indent=4)

print("Archivo JSON con los diálogos clasificados generado con éxito.")
