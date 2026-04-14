import { HistoryItem, GenerationOutput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://goodn6138--ai-hardware-service-fastapi-app.modal.run';

export async function generateHardware(prompt: string): Promise<GenerationOutput> {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });
  
  if (!response.ok) {
    throw new Error(`Generation failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  const baseUrl = API_URL;
  const fullUrl = (url: string) => url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Fetch all files
  const [stlRes, scadRes, circuitRes, firmwareRes, bomRes] = await Promise.all([
    fetch(fullUrl(data.downloads.individual_files.stl.url)),
    fetch(fullUrl(data.downloads.individual_files.scad.url)),
    fetch(fullUrl(data.downloads.individual_files.circuit.url)),
    fetch(fullUrl(data.downloads.individual_files.firmware.url)),
    fetch(fullUrl(data.downloads.individual_files.bom.url))
  ]);
  
  if (!stlRes.ok) throw new Error('STL fetch failed');
  const stlBuffer = await stlRes.arrayBuffer();
  if (!stlBuffer?.byteLength) throw new Error('Empty STL');
  
  const [scadText, circuitJson, firmwareText, bomText] = await Promise.all([
    scadRes.text(),
    circuitRes.json(),
    firmwareRes.text(),
    bomRes.text()
  ]);
  
  return {
    ...data,
    stlData: stlBuffer,
    scadContent: scadText,
    circuitData: circuitJson,
    firmwareContent: firmwareText,
    bomContent: bomText,
    original_prompt: prompt
  };
}