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
        prompt: `De acuerdo a la pagina "https://www.monterrey.gob.mx/noticia/graduan-adultos-de-talleres-productivos", y el siguiente texto: ${text} explica como afecta a la ciudadanía de Monterrey`,
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