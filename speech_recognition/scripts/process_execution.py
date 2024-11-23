import subprocess
import sys
import os

# Funcion para obtener el path a la carpeta del feature 
def get_feature_path(feature_folder, filename=None):
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(project_dir, feature_folder)
    os.makedirs(folder_path, exist_ok=True)
    if filename:
        return os.path.join(folder_path, filename)
    return folder_path

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Define the paths to the Python files
download_audio_script = os.path.join(current_dir, "download_audio.py")
transcription_script = os.path.join(current_dir, "yt_transcription.py")
diarization_script = os.path.join(current_dir, "diarization.py")
episode_text_script = os.path.join(current_dir, "yt_episode_text.py")

# Use the same Python interpreter that's running this script
python_executable = sys.executable

def run_script(script_name, script_path):
    print(f"Ejecutando {script_name}...")
    try:
        subprocess.run([python_executable, script_path], check=True)
        print(f"{script_name} completado.")
    except subprocess.CalledProcessError as e:
        print(f"Error executing {script_name}: {e}")
        sys.exit(1)

run_script("download_audio.py", download_audio_script)
run_script("transcription.py", transcription_script)
run_script("diarization.py", diarization_script)
run_script("episode_text.py", episode_text_script)
