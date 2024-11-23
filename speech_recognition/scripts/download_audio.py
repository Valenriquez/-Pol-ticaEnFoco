# pip install yt-dlp
# pip install pydub
from pydub import AudioSegment
import subprocess
import os


# Funcion para obtener el path a la carpeta del feature (audio_files)
def get_feature_path(feature_folder, filename):
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(project_dir, feature_folder)
    os.makedirs(folder_path, exist_ok=True)
    return os.path.join(folder_path, filename)


def descargar_audio_wav(youtube_url, output_file='output.wav'):
    try:
        # Definir ruta de salida de archivo mp3
        mp3_path = f"{output_file}.mp3"

        # Construcion de la ruta completa del archivo de salida
        output_path = get_feature_path("audio_files", output_file)

        # Descargar audio usando yt-dlp
        print("Descargando audio...")
        subprocess.run(["yt-dlp", "--extract-audio", "--audio-format", "mp3", 
                        "-o", mp3_path, youtube_url], check=True)
        
        print(f"Audio descargado como: {mp3_path}")
        
        # Convertir a WAV
        print("Convirtiendo a WAV...")
        AudioSegment.from_file(mp3_path).export(output_path, format="wav")
        os.remove(mp3_path)
        
        print(f"Archivo WAV guardado como: {output_path}")
    except Exception as e:
        print(f"Error: {e}")

# Ejemplo de uso
youtube_url = "https://www.youtube.com/watch?v=WoH0koaIdF4"
descargar_audio_wav(youtube_url)
