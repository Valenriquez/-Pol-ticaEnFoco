import pandas as pd
import json
import os
import csv

# Cargar los archivos
audio_tsv = pd.read_csv("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/audio.tsv", sep='\t')  # Archivo de transcripción
with open("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/appearances/speaker_times.json", "r") as json_file:
    speaker_times = json.load(json_file)  # Archivo de tiempos de los speakers

# Inicializar una lista para almacenar los diálogos clasificados
dialogues = []

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
            # Añadir el diálogo a la lista con la estructura requerida
            dialogues.append([speaker, start_time, end_time, dialogo])
            break  # Asumimos que el diálogo pertenece solo a un speaker, así que salimos del loop

# Crear la carpeta para guardar el archivo CSV si no existe
if not os.path.exists("speech-clasification"):
    os.makedirs("speech-clasification")

# Guardar los diálogos clasificados en un archivo CSV
csv_file_path = "speech-clasification/speaker_dialogues.csv"

with open(csv_file_path, mode='w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.writer(csv_file)
    
    # Escribir el encabezado del CSV
    csv_writer.writerow(["speaker", "start", "end", "text"])
    
    # Escribir cada diálogo clasificado
    csv_writer.writerows(dialogues)

print(f"Archivo CSV con los diálogos clasificados generado con éxito en {csv_file_path}.")
