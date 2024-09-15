#ffmpeg

from moviepy.editor import VideoFileClip
import os

# Ruta al archivo de video
video_path = 'C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/video.mp4'

# Lista de momentos en segundos donde se quieren tomar las capturas
capture_times = [5, 10, 20]  # En segundos

# Definir la carpeta donde se guardarán las capturas
save_path = 'images'

# Asegurarse de que la carpeta de guardado exista
if not os.path.exists(save_path):
    os.makedirs(save_path)

# Cargar el video
clip = VideoFileClip(video_path)

# Recorrer los tiempos especificados y extraer las capturas
for time_sec in capture_times:
    # Extraer el fotograma en el tiempo especificado
    frame = clip.get_frame(time_sec)
    
    # Guardar la imagen como un archivo PNG
    output_image_path = os.path.join(save_path, f'capture_at_{time_sec}s.png')
    clip.save_frame(output_image_path, t=time_sec)
    print(f'Captura guardada en: {output_image_path}')
