import csv
import json
import os


# Funcion para obtener el path a la carpeta del feature 
def get_feature_path(feature_folder, filename=None):
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(project_dir, feature_folder)
    os.makedirs(folder_path, exist_ok=True)
    if filename:
        return os.path.join(folder_path, filename)
    return folder_path


# Función para cargar el archivo A (tsv)
def load_transcription_file(transcription_file):
    data_a = []
    with open(transcription_file, mode='r') as file:
        reader = csv.DictReader(file, delimiter='\t')
        for row in reader:
            data_a.append({
                "start": float(row['start']),
                "end": float(row['end']),
                "text": row['text']
            })
    return data_a

# Función para cargar el archivo B (csv)
def load_diarization_file(diarization_file):
    data_b = []
    with open(diarization_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data_b.append({
                "speaker": row['Speaker'],
                "start": float(row['Start Time']),
                "end": float(row['End Time'])
            })
    return data_b

# Función con two-pointers para evitar duplicación y procesar eficientemente
def match_speaker_with_text_two_pointers(transcription_file_data, diarization_file_data):
    results = []
    a_idx = 0
    b_idx = 0

    while b_idx < len(diarization_file_data):
        b = diarization_file_data[b_idx]
        speaker_text = []
        
        # Usamos el puntero a_idx para procesar los textos de A
        while a_idx < len(transcription_file_data):
            a = transcription_file_data[a_idx]
            a_start_seconds = a['start']
            a_end_seconds = a['end']

            # Verificar si hay solapamiento entre A y B
            if a_end_seconds < b['start']:
                # Si A termina antes de que B empiece, avanzamos en A
                a_idx += 1
            elif a_start_seconds > b['end']:
                # Si A empieza después de que B termina, dejamos de procesar A para este B
                break
            else:
                # Hay solapamiento, añadimos el texto
                speaker_text.append(a['text'])
                a_idx += 1

        # Concatenar el texto del speaker actual
        concatenated_text = " ".join(speaker_text)

        # # Si no tiene speaker asignado, interpolar usando el contexto
        # if b['speaker'] == '':
        #     previous_speaker = diarization_file_data[b_idx-1]['speaker'] if b_idx > 0 else None
        #     next_speaker = diarization_file_data[b_idx+1]['speaker'] if b_idx < len(diarization_file_data)-1 else None
        #     if previous_speaker and next_speaker and previous_speaker == next_speaker:
        #         b['speaker'] = previous_speaker
        #     elif previous_speaker:
        #         b['speaker'] = previous_speaker
        #     elif next_speaker:
        #         b['speaker'] = next_speaker

        # Agregar los datos al resultado final
        if concatenated_text.strip() != '':
            results.append({
                "speaker": b['speaker'],
                "start_time": b['start'],
                "end_time": b['end'],
                "text": concatenated_text
            })

        # Avanzar en B
        b_idx += 1

    return results


def assign_text_to_speaker_weighted(transcription_data, diarization_data):
    results = []
    for text_segment in transcription_data:
        
        text_start = text_segment["start"]
        text_end = text_segment["end"]
        text_content = text_segment["text"]

        max_overlap = 0
        best_speaker = None
        best_speakermax_overlap_start = None
        best_speaker_end = None

        for speaker_segment in diarization_data:

            speaker_start = speaker_segment["start"]
            speaker_end = speaker_segment["end"]
            speaker_name = speaker_segment["speaker"]

            #Calcular la interseccion temporal entre el texto y el speaker
            overlap_start = max(text_start, speaker_start)
            overlap_end = min(text_end, speaker_end)
            overlap_duration = max(0, overlap_end - overlap_start)

            # Calcular la duración del texto y la fracción de intersección
            text_duration = text_end - text_start
            overlap_fraction = overlap_duration / text_duration

            # Si encontramos un mejor candidato, lo asignamos
            if overlap_fraction > max_overlap:
                max_overlap = overlap_fraction
                best_speaker = speaker_name
                best_speaker_start = speaker_start
                best_speaker_end = speaker_end

         # Si hay al menos una intersección, asignar el texto al mejor speaker
        if best_speaker is not None:
            results.append({
                "speaker": best_speaker,
                "start_time": best_speaker_start,
                "end_time": best_speaker_end,
                "text": text_content
            })

    return results


def compress_speaker_dialogues(data):
    compressed_data = []
    
    # Inicializa el primer segmento
    current_speaker = data[0]['speaker']
    current_start = data[0]['start_time']
    current_end = data[0]['end_time']
    current_text = data[0]['text']
    
    # Itera sobre el resto de los segmentos
    for i in range(1, len(data)):
        segment = data[i]
        
        if segment['speaker'] == current_speaker and segment['start_time'] <= current_end:
            # Si el speaker es el mismo y los intervalos se solapan/son contiguos, combinar
            current_end = max(current_end, segment['end_time'])
            current_text += " " + segment['text']
        else:
            # Si el speaker cambia o no son contiguos, guardar el segmento actual y reiniciar
            compressed_data.append({
                'speaker': current_speaker,
                'start_time': current_start,
                'end_time': current_end,
                'text': current_text.strip()
            })
            current_speaker = segment['speaker']
            current_start = segment['start_time']
            current_end = segment['end_time']
            current_text = segment['text']
    
    # Agregar el último segmento
    compressed_data.append({
        'speaker': current_speaker,
        'start_time': current_start,
        'end_time': current_end,
        'text': current_text.strip()
    })
    
    return compressed_data

# Función para guardar el archivo JSON en el directorio global
def save_json(data, filename):
    project_dir = os.path.dirname(os.path.abspath(__file__))
    json_dir = os.path.join(project_dir, "../json_files")
    os.makedirs(json_dir, exist_ok=True)
    filepath = os.path.join(json_dir, filename)
    
    compressed_data = compress_speaker_dialogues(data)

    with open(filepath, "w") as f:
        json.dump(compressed_data, f, indent=4)

    print(f"Archivo JSON guardado en: {filepath}")



# Rutas de los archivos
transcription_file = "yt_transcription.tsv"  # Asegúrate de que sea la ruta correcta del archivo A (TSV)
diarization_file = "compressed_diarization_output.csv"  # Asegúrate de que sea la ruta correcta del archivo B (CSV)
output_file = "yt_time_line.json"

transcription_path = get_feature_path("text_files", transcription_file);
diarization_path = get_feature_path("text_files", diarization_file);


# Cargar los datos de ambos archivos
transcription_file_data = load_transcription_file(transcription_path)
diarization_file_data = load_diarization_file(diarization_path)

# Encontrar el texto correspondiente para cada speaker en el archivo B
# result_data = match_speaker_with_text_two_pointers(transcription_file_data, diarization_file_data)
result_data = assign_text_to_speaker_weighted(transcription_file_data, diarization_file_data)


# Guardar el resultado como JSON

save_json(result_data, output_file)

print(f"Archivo JSON refinado como {output_file}")
