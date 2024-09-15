import requests
import json

# Ruta al archivo JSON
file_path = 'C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/speech-clasification/speaker_dialogues.json'

# Abriendo el archivo y cargando el contenido
with open(file_path, 'r') as file:
    speaker_dialogues = json.load(file)

# Inicializar un diccionario para almacenar las respuestas
respuestas_speakers = {}

# Función para enviar un prompt a un servidor de modelos de lenguaje
def enviar_prompt(speaker, dialogos):
    # Concatenar los diálogos en un solo bloque de texto
    texto_completo = " ".join(dialogos)
    
    # Payload con el prompt a enviar
    payload = {
        "model": "codegemma",  # Ajusta el modelo que estás utilizando
        "messages": [
            {
                "role": "user",
                "content": f"Este es el diálogo de {speaker}:\n\n{texto_completo}\n\nPor favor, realiza lo siguiente:\n1. Genera un resumen breve.\n2. Identifica cualquier falacia argumentativa en el texto."
            },
        ],
        "format": "json",
        "stream": False,  # No es necesario hacer streaming
        "options": {
            "temperature": 0.7
        }
    }

    # Enviar la solicitud POST al servidor
    response = requests.post(
        "http://localhost:11434/api/chat",  # Cambia la URL por el servidor adecuado
        json=payload
    )

    # Verificar la respuesta y devolverla
    if response.status_code == 200:
        return response.json()['message']['content']
    else:
        return f"Error: {response.status_code}, {response.text}"

# Iterar sobre cada speaker y sus diálogos
for speaker, dialogos in speaker_dialogues.items():
    # Enviar el prompt al modelo
    resultado = enviar_prompt(speaker, dialogos)
    
    # Guardar el resultado en el diccionario
    respuestas_speakers[speaker] = resultado
    
    # Mostrar el resultado para cada speaker
    print(f"Resultado para {speaker}:\n{resultado}\n{'-'*50}")

# Guardar las respuestas en un archivo JSON
output_file = 'C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/speech-analysis/respuestas_speakers.json'

with open(output_file, 'w') as json_output_file:
    json.dump(respuestas_speakers, json_output_file, indent=4)

print(f"Respuestas guardadas exitosamente en {output_file}.")
