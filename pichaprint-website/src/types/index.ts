export interface GenerationOutput {
  device_name: string;
  generated_at: string;
  original_prompt: string;
  stlData: ArrayBuffer;
  scadContent: string;
  circuitData: CircuitData;
  firmwareContent: string;
  bomContent: string;
  downloads: {
    individual_files: {
      stl: { url: string };
      scad: { url: string };
      circuit: { url: string };
      firmware: { url: string };
      bom: { url: string };
    }
  }
}

export interface CircuitData {
  nodes: Array<{
    id: string;
    label: string;
    x?: number;
    y?: number;
  }>;
  connections: Array<{
    source: string;
    target: string;
    label?: string;
  }>;
}

export interface HistoryItem {
  id: number;
  timestamp: string;
  input: string;
  output: GenerationOutput;
  deviceName: string;
}