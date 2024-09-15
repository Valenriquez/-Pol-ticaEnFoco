import pandas as pd
import json
import os

# Cargar el archivo CSV
df = pd.read_csv("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/diarize_segments.csv")

# Crear un diccionario para almacenar los tiempos de cada speaker
speaker_times = {}

# Iterar sobre las filas del DataFrame
for index, row in df.iterrows():
    speaker = row['speaker']
    start_time = row['start']  # Tiempo de inicio en segundos
    end_time = row['end']  # Tiempo de fin en segundos
    
    # Verificar si el speaker ya existe en el diccionario
    if speaker not in speaker_times:
        speaker_times[speaker] = []
    
    # Calcular el tiempo medio
    middle_time = (start_time + end_time) / 2
    # Agregar el tiempo de aparición (en este caso el tiempo de medio)
    speaker_times[speaker].append(middle_time)


# Crear la carpeta para guardar los tiempos de aparición
if not os.path.exists("appearances"):
    os.makedirs("appearances")
    
# Guardar los tiempos en un archivo JSON
with open("appearances/speaker_times.json", "w") as json_file:
    json.dump(speaker_times, json_file, indent=4)

print("Archivo JSON generado con éxito.")
