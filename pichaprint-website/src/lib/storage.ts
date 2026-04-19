import { HistoryItem, GenerationOutput } from '../types';
import { getToken } from './auth';
import { listDesigns, saveDesignToBackend } from './api';

class StorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'pichaprint_db';
  private readonly STORE_NAME = 'designs';
  private readonly DB_VERSION = 1;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('deviceName', 'deviceName', { unique: false });
        }
      };
    });
  }

  async addDesign(input: string, output: GenerationOutput): Promise<HistoryItem> {
    const token = getToken();
    if (token) {
      // Persist to backend
      const payload = {
        input_text: input,
        output_json: JSON.stringify(output)
      };
      const saved = await saveDesignToBackend(token, payload.input_text, payload.output_json);
      const entry: HistoryItem = {
        id: saved.id,
        timestamp: saved.timestamp,
        input,
        output,
        deviceName: output.device_name || 'unnamed'
      };
      return entry;
    }

    await this.init();
    const entry: HistoryItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      input,
      output,
      deviceName: output.device_name || 'unnamed'
    };
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.put(entry);
      
      request.onsuccess = () => resolve(entry);
      request.onerror = () => reject(request.error);
    });
  }

  async getHistory(): Promise<HistoryItem[]> {
    const token = getToken();
    if (token) {
      const list = await listDesigns(token);
      // Convert backend items to HistoryItem shape
      return list.map((it: any) => ({
        id: it.id,
        timestamp: it.timestamp,
        input: it.input_text,
        output: JSON.parse(it.output_json),
        deviceName: JSON.parse(it.output_json).device_name || 'unnamed'
      }));
    }

    await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.index('timestamp').openCursor(null, 'prev');
      const results: HistoryItem[] = [];
      
      request.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async loadDesign(id: number): Promise<HistoryItem | null> {
    const token = getToken();
    if (token) {
      const list = await listDesigns(token);
      const item = list.find((it: any) => it.id === id);
      if (!item) return null;
      return {
        id: item.id,
        timestamp: item.timestamp,
        input: item.input_text,
        output: JSON.parse(item.output_json),
        deviceName: JSON.parse(item.output_json).device_name || 'unnamed'
      };
    }

    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDesign(id: number): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearHistory(): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const storage = new StorageService();