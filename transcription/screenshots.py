#ffmpeg
#pip install moviepy

from moviepy.editor import VideoFileClip
import os
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
    
    
# Lista de momentos en segundos donde se quieren tomar las capturas
capture_times = []  # En segundos
  
for speaker in speaker_times:
    time = seleccionar_tiempo(speaker, metodo="random")
    capture_times.append({"speaker": speaker, "time": time})


# Ruta al archivo de video
video_path = 'C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/video.mp4'

# Definir la carpeta donde se guardarán las capturas
save_path = 'images'

# Asegurarse de que la carpeta de guardado exista
if not os.path.exists(save_path):
    os.makedirs(save_path)

# Cargar el video
clip = VideoFileClip(video_path)

# Recorrer los tiempos especificados y extraer las capturas
for speaker in capture_times:
    # Extraer el fotograma en el tiempo especificado
    speaker_name = speaker['speaker']
    time_sec = speaker['time']
    frame = clip.get_frame(time_sec)
    
    # Guardar la imagen como un archivo PNG
    output_image_path = os.path.join(save_path, f'{speaker_name}_at_{int(time_sec)}s.png')
    clip.save_frame(output_image_path, t=time_sec)
    print(f'Captura guardada en: {output_image_path}')
