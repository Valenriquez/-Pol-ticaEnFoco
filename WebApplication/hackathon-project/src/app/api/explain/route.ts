import { NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    console.log('Received text:', text);

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'codegemma',
        prompt: `Los resultados de la búsqueda corresponden a la publicación del Decreto por el que se crea el Instituto Federal de Transparencia y Acceso a la Información Pública con personalidad jurídica y fondos propios.
   - Este Instituto se crea para cumplir con las responsabilidades señaladas en la Ley Federal de Transparencia y Acceso a la Información Pública Resumen
   - El Decreto incluye disposiciones relacionadas con riesgos laborales para los empleados y la evaluación de un programa piloto por parte del Instituto Mexicano del Seguro Social [Página no. 7 Página núm. 2]
   - Existen plazos para que los empleadores realicen los cambios necesarios en materia de registro laboral ante el Instituto Mexicano del Seguro Social [Página no. 6]
   - El Instituto está obligado a presentar un informe preliminar al Poder Legislativo luego de 18 meses de implementación del programa piloto [Página no. 2]
   - El Decreto menciona la importancia de la supervisión, inspección, salarios mínimos por oficio y trámites administrativos para garantizar certidumbre y eficacia  , y la siguiente noticia: ${text} explica como afecta dicha información al ciudadano`,
        stream: false, // Add this line to request a non-streaming response
      }),
    });

    console.log('Ollama response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error response:', errorText);
      throw new Error(`Failed to get explanation from Ollama: ${errorText}`);
    }

    const data = await response.json();
    console.log('Parsed Ollama response:', data);

    if (!data.response) {
      throw new Error('Unexpected response format from Ollama');
    }

    return NextResponse.json({ explanation: data.response });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to get explanation', details: errorMessage }, { status: 500 });
  }
}