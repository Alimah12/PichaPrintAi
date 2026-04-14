'use client';

import { useState, useEffect } from 'react';
import Hero from './Hero';
import PromptInput from './PromptInput';
import STLViewer from './STLViewer';
import CircuitViewer from './CircuitViewer';
import FirmwareEditor from './FirmwareEditor';
import BOMTable from './BOMTable';
import HistoryDrawer from './HistoryDrawer';
import BuildOrderModal from './BuildOrderModal';
import { generateHardware } from '../lib/api';
import { storage } from '../lib/storage';
import { HistoryItem, GenerationOutput } from '../types';

type TabType = 'scad' | 'circuit' | 'firmware' | 'bom';

export function GeneratorInterface({ initialShowGenerator = false }: { initialShowGenerator?: boolean }) {
  const [showGenerator, setShowGenerator] = useState(initialShowGenerator);
  const [loading, setLoading] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<GenerationOutput | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('scad');
  const [error, setError] = useState<string | null>(null);
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  
  useEffect(() => {
    storage.init()
      .then(() => {
        setStorageReady(true);
        loadHistory();
      })
      .catch(err => {
        console.error('Storage init failed:', err);
        setError('Failed to initialize storage');
      });
  }, []);
  
  const loadHistory = async () => {
    try {
      const h = await storage.getHistory();
      setHistory(h);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };
  
  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim() || loading || !storageReady) return;
    setLoading(true);
    setError(null);
    
    try {
      const output = await generateHardware(prompt);
      console.log('Generated output:', output);
      console.log('Firmware content:', output.firmwareContent);
      console.log('Firmware content length:', output.firmwareContent?.length);
      await storage.addDesign(prompt, output);
      setCurrentOutput(output);
      await loadHistory();
      setShowGenerator(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };
  
  const loadHistoryItem = async (item: HistoryItem) => {
    try {
      const fullEntry = await storage.loadDesign(item.id);
      if (fullEntry && fullEntry.output) {
        setCurrentOutput(fullEntry.output);
        setIsDrawerOpen(false);
        setShowGenerator(true);
      } else {
        setError('Design not found in storage');
      }
    } catch (err) {
      console.error('Error loading history item:', err);
      setError('Failed to load design from history');
    }
  };
  
  const downloadSTL = () => {
    if (!currentOutput?.stlData) return;
    const blob = new Blob([currentOutput.stlData], { type: 'application/sla' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentOutput.device_name}.stl`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // If generator hasn't been activated, show Hero
  if (!showGenerator) {
    return <Hero onGetStarted={() => setShowGenerator(true)} />;
  }
  
  // Main generator view
  return (
    <div className="min-h-screen bg-gray-900">
      <HistoryDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        history={history}
        onLoadItem={loadHistoryItem}
        onClearAll={async () => {
          await storage.clearHistory();
          await loadHistory();
        }}
      />
      
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-white/90 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">pichaprint</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowGenerator(false)}
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            New Design
          </button>
          {currentOutput && (
            <button 
              onClick={() => setIsBuildModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-medium rounded-lg hover:scale-105 transition-all shadow-lg shadow-emerald-500/25"
            >
              Build
            </button>
          )}
        </div>
      </header>
      
      <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto">
        <div className="space-y-6">
          {/* Current device info */}
          {currentOutput && (
            <div className="flex items-center justify-between pb-4 border-b border-white/20">
              <div>
                <h2 className="text-lg font-medium text-white">{currentOutput.device_name}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(currentOutput.generated_at).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setIsBuildModalOpen(true)}
                className="px-3 py-1.5 text-xs border border-gray-200 text-gray-700 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Download STL
              </button>
            </div>
          )}
          
          {/* Tabs */}
          <div className="flex gap-6 border-b border-white/20">
            {[
              { id: 'scad' as TabType, label: '3D View' },
              { id: 'circuit' as TabType, label: 'Circuit' },
              { id: 'firmware' as TabType, label: 'Firmware' },
              { id: 'bom' as TabType, label: 'BOM' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-white text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab content */}
          <div className="py-4">
            {activeTab === 'scad' && currentOutput && (
              <div className="space-y-4">
                <STLViewer 
                  stlData={currentOutput.stlData} 
                  deviceName={currentOutput.device_name}
                />
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-medium text-gray-300 uppercase tracking-wider">OpenSCAD Source</h3>
                    <button 
                      onClick={() => downloadFile(currentOutput.scadContent, `${currentOutput.device_name}.scad`, 'text/plain')}
                      className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-gray-600 overflow-auto max-h-48 p-2 bg-white rounded border border-gray-200">
                    {currentOutput.scadContent || 'No SCAD code available'}
                  </pre>
                </div>
              </div>
            )}
            
            {activeTab === 'circuit' && currentOutput && (
              <CircuitViewer circuitData={currentOutput.circuitData} />
            )}
            
            {activeTab === 'firmware' && currentOutput && (
              <div>
                <FirmwareEditor code={currentOutput.firmwareContent || ''} />
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => downloadFile(currentOutput.firmwareContent, `${currentOutput.device_name}.ino`, 'text/plain')}
                    className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download .ino
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'bom' && currentOutput && (
              <div>
                <BOMTable csvData={currentOutput.bomContent || null} />
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => downloadFile(currentOutput.bomContent, `${currentOutput.device_name}_BOM.csv`, 'text/csv')}
                    className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-white/20 p-4 z-40">
        <div className="max-w-2xl mx-auto">
          <PromptInput 
            onSubmit={handleGenerate}
            isLoading={loading}
            placeholder={currentOutput ? "Design another device..." : "Describe your hardware device..."}
          />
          {error && (
            <div className="absolute -top-8 left-0 right-0 text-center text-xs text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
      
      <BuildOrderModal 
        isOpen={isBuildModalOpen} 
        onClose={() => setIsBuildModalOpen(false)} 
        currentOutput={currentOutput}
      />
    </div>
  );
}