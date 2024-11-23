# pip install pyannote.audio
import csv
import os
from pyannote.audio import Pipeline
from dotenv import load_dotenv

# Funcion para obtener el path a la carpeta del feature 
def get_feature_path(feature_folder, filename=None):
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(project_dir, feature_folder)
    os.makedirs(folder_path, exist_ok=True)
    if filename:
        return os.path.join(folder_path, filename)
    return folder_path

# Funcion para buscar un archivo de audio en el directorio audio_files
def find_audio_file(filename):
    audio_files_dir = get_feature_path("audio_files")
    audio_path = get_feature_path("audio_files", filename)
    if os.path.exists(audio_path):
        return audio_path
    else:
        raise FileNotFoundError(f"El archivo de audio {filename} no se encontró en {audio_files_dir}.")


#Cargar el access key de Hugging Face
load_dotenv()
hf_pass_key = os.getenv("HF_PASS_KEY")


# Initialize the pipeline
pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token = hf_pass_key
)


def perform_diarization(audio_filename, csv_output_filename="compressed_diarization_output.csv"):
    try:
        # Buscar el archivo de audio en audio_files
        audio_file = find_audio_file(audio_filename) 
       
        # Perform diarization
        print(f"Performing diarization on {audio_file}")
        diarization = pipeline(audio_file)

        # Nombre del archivo CSV de salida
        csv_filename = "compressed_diarization_output.csv"

        # Crear lista para almacenar los intervalos comprimidos
        compressed_diarization = []

        # Inicializar variables para almacenar el speaker actual y su intervalo
        current_speaker = None
        current_start = None
        current_end = None

        # Recorrer los resultados de la diarización
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            if speaker == current_speaker:
                # Si el mismo speaker continúa, actualiza el final del intervalo
                current_end = turn.end
            else:
                # Si el speaker cambia, guarda el intervalo anterior
                if current_speaker is not None:
                    compressed_diarization.append([f"{current_speaker}", current_start, current_end])
                # Actualizar al nuevo speaker y su intervalo
                current_speaker = speaker
                current_start = turn.start
                current_end = turn.end

        # Añadir el último intervalo si existe
        if current_speaker is not None:
            compressed_diarization.append([f"{current_speaker}", current_start, current_end])

        # Guardar los intervalos comprimidos en el archivo CSV
        output_path = get_feature_path("text_files", csv_output_filename)
        with open(output_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            # Escribir la cabecera
            writer.writerow(["Speaker", "Start Time", "End Time"])

            # Escribir los datos comprimidos
            writer.writerows(compressed_diarization)

        print(f"Archivo CSV comprimido guardado como {output_path}")
        return output_path
    
    except FileNotFoundError as e:
        print(e)
    except Exception as e:
        print(f"Error durante la diarización: {e}")


# Ejemplo de uso
if __name__ == "__main__":
    audio_filename = "output.wav"  # Nombre del archivo de audio
    perform_diarization(audio_filename)
