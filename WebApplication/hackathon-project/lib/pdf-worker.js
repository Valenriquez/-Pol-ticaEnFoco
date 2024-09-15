import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

if (typeof window === 'undefined') {
  // Server-side
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
} else {
  // Client-side
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.workerSrc.split('/')[3]}/pdf.worker.min.js`;
}