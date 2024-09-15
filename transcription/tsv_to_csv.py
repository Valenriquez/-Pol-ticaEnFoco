import pandas as pd

# Función para convertir TSV a CSV
def tsv_a_csv(input_tsv, output_csv):
    # Leer el archivo TSV
    df = pd.read_csv(input_tsv, sep='\t')
    
    # Guardar el DataFrame como CSV
    df.to_csv(output_csv, index=False)

# Uso de la función
input_tsv = "C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/audio.tsv"  # Ruta del archivo TSV
output_csv = "C:/Users/roves/Documents/Hackatons/HackMTY2024/Newfolder/PoliticaEnFoco/transcription/audio.csv"  # Ruta del archivo CSV de salida

tsv_a_csv(input_tsv, output_csv)

print(f"El archivo {input_tsv} ha sido convertido a {output_csv} con éxito.")
