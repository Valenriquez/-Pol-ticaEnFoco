# pip install pyannote.audio
from pyannote.audio import Pipeline

# Cargar el pipeline preentrenado de diarización de locutores
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization")

# Ruta del archivo de audio
audio_path = "audio.mp3"

# Realizar la diarización
diarization = pipeline(audio_path)

# Mostrar los resultados de la diarización (quién habla y cuándo)
for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(f"Speaker {speaker} habló de {turn.start:.1f}s a {turn.end:.1f}s")