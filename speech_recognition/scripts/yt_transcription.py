
# pip install youtube-transcript-api
import os
from youtube_transcript_api import YouTubeTranscriptApi
import csv

# Funcion para extraer el ID del video desde el link de YouTube
def get_video_id(youtube_url):
    return youtube_url.split("v=")[-1]

# Funcion para obtener el path a la carpeta del feature (text_files)
def get_feature_path(feature_folder, filename):
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(project_dir, feature_folder)
    os.makedirs(folder_path, exist_ok=True)
    return os.path.join(folder_path, filename)

# Función para obtener la transcripción y guardarla en formato TSV
def get_transcription_tsv(youtube_url, idioma='en', output_file='yt_transcription.tsv'):
    
    # Construcion de la ruta completa del archivo de salida
    output_path = get_feature_path("text_files", output_file)

    video_id = get_video_id(youtube_url)
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[idioma])
        with open(output_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file, delimiter='\t')
            writer.writerow(["start", "end", "text"])  # Encabezados
            for i in transcript:
                start_time = i['start']
                duration = i['duration']
                end_time = start_time + duration
                text = i['text']
                writer.writerow([start_time, end_time, text])
        print(f"Transcripción guardada en {output_path}")
    except Exception as e:
        print(f"No se pudo obtener la transcripción: {e}")

# Ejemplo de uso
youtube_url = 'https://www.youtube.com/watch?v=WoH0koaIdF4'
get_transcription_tsv(youtube_url)
