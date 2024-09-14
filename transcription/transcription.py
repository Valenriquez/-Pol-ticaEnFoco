#pip install git+https://github.com/openai/whisper.git
import whisper

# Cargar el modelo de Whisper
model = whisper.load_model("base")

# Ruta del archivo de audio a transcribir
audio_path = "audio.mp3"

# Transcribir el audio
result = model.transcribe(audio_path, language="es")

# Mostrar la transcripción
print("Transcripción:")
print(result["text"])