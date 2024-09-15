import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import './pdf-worker'; // Add this line at the top of the file

const OLLAMA_BASE_URL = 'http://localhost:11434'; // Adjust if your Ollama instance is running elsewhere
const OLLAMA_MODEL = 'codegemma:latest'; // Update this line

export class RAG {
  private vectorStore: number[][] = [];
  private documents: string[] = [];
  isSetup: boolean = false;

  async setupRag(pdfUrl: string) {
    try {
      console.log('Fetching PDF...');
      const pdfData = await this.fetchPdf(pdfUrl);
      console.log('Extracting text from PDF...');
      const text = await this.extractTextFromPdf(pdfData);
      console.log('Splitting text into chunks...');
      const chunks = this.splitTextIntoChunks(text);
      console.log('Creating embeddings...');
      await this.createEmbeddings(chunks);
      this.isSetup = true;
      console.log('RAG setup complete');
    } catch (error) {
      console.error('Error in setupRag:', error);
      throw error;
    }
  }

  private async fetchPdf(url: string): Promise<Uint8Array> {
    try {
      console.log('Fetching PDF from URL:', url);
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      console.log('PDF fetched successfully');
      return new Uint8Array(response.data);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      throw error;
    }
  }

  private async extractTextFromPdf(pdfData: Uint8Array): Promise<string> {
    try {
      console.log('Loading PDF document...');
      if (typeof window === 'undefined') {
        // Server-side
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }
      const loadingTask = pdfjsLib.getDocument(pdfData);
      const pdf = await loadingTask.promise;
      console.log('PDF document loaded successfully');

      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Extracting text from page ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ');
      }

      console.log('Text extraction complete');
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }

  private splitTextIntoChunks(text: string, chunkSize: number = 1000): string[] {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  }

  private async createEmbeddings(chunks: string[]) {
    for (let i = 0; i < chunks.length; i++) {
      try {
        console.log(`Creating embedding for chunk ${i + 1}/${chunks.length}`);
        const embedding = await this.getEmbedding(chunks[i]);
        this.vectorStore.push(embedding);
        this.documents.push(chunks[i]);
      } catch (error) {
        console.error(`Error creating embedding for chunk ${i + 1}:`, error);
        throw error;
      }
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/embeddings`, {
        model: OLLAMA_MODEL, // Use the constant here
        prompt: text
      });
      if (!response.data.embedding) {
        throw new Error('No embedding returned from Ollama');
      }
      return response.data.embedding;
    } catch (error) {
      console.error('Error getting embedding:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private async findSimilarDocuments(query: string, k: number = 3): Promise<string[]> {
    const queryEmbedding = await this.getEmbedding(query);
    const similarities = this.vectorStore.map(docEmbedding => 
      this.cosineSimilarity(queryEmbedding, docEmbedding)
    );
    const topIndices = similarities
      .map((similarity, index) => ({ similarity, index }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k)
      .map(item => item.index);
    return topIndices.map(index => this.documents[index]);
  }

  async query(question: string): Promise<string> {
    if (!this.isSetup) {
      throw new Error("RAG is not set up. Call setupRag first.");
    }

    try {
      console.log('Finding similar documents...');
      const relevantDocs = await this.findSimilarDocuments(question);
      const context = relevantDocs.join("\n\n");

      console.log('Sending request to Ollama...');
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: OLLAMA_MODEL, // Use the constant here
        prompt: `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`,
        stream: true
      }, {
        responseType: 'stream'
      });

      console.log('Processing Ollama response...');
      let fullResponse = '';
      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullResponse += parsed.response;
            }
          } catch (parseError) {
            console.error('Error parsing JSON:', line);
            console.error('Parse error:', parseError);
          }
        }
      }

      if (!fullResponse) {
        throw new Error('No response generated from Ollama');
      }

      console.log('Query complete');
      return fullResponse.trim();
    } catch (error) {
      console.error('Detailed error in RAG query:', error);
      throw error;
    }
  }
}