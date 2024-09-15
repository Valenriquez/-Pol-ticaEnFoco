import json
import csv

# Cargar el archivo JSON
with open("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/appearances/speaker_times.json", "r") as json_file:
    data = json.load(json_file)

# Abrir un archivo CSV para escribir los datos
with open("C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/speaker_times.csv", "w", newline="") as csv_file:
    csv_writer = csv.writer(csv_file)
    
    # Escribir el encabezado
    csv_writer.writerow(["Speaker", "Start Time", "End Time"])
    
    # Iterar sobre los speakers y sus tiempos
    for speaker, times in data.items():
        for time_range in times:
            start_time, end_time = time_range
            # Escribir cada rango de tiempo en una fila
            csv_writer.writerow([speaker, start_time, end_time])

print("El archivo CSV ha sido generado con éxito.")
