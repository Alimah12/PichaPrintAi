'use client';

import { useEffect, useRef } from 'react';

interface FirmwareEditorProps {
  code: string;
}

declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}

export default function FirmwareEditor({ code }: FirmwareEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  
  useEffect(() => {
    console.log('FirmwareEditor received code:', code);
    console.log('Code length:', code?.length);
    console.log('Code is empty?', !code || code.trim() === '');
    
    if (!containerRef.current || !code || code.trim() === '') return;
    
    // Load Monaco Editor dynamically
    const loadMonaco = async () => {
      if (typeof window !== 'undefined' && !window.monaco) {
        // Monaco is already loaded via CDN in your HTML
        // For Next.js, we need to ensure it's available
        if (window.require) {
          window.require.config({ 
            paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' }
          });
          
          window.require(['vs/editor/editor.main'], () => {
            if (editorRef.current) return;
            editorRef.current = window.monaco.editor.create(containerRef.current, {
              value: code,
              language: 'cpp',
              theme: 'vs-light',
              automaticLayout: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily: 'SF Mono, Monaco, monospace',
              lineNumbers: 'on',
              readOnly: true
            });
          });
        }
      } else if (window.monaco && !editorRef.current) {
        editorRef.current = window.monaco.editor.create(containerRef.current, {
          value: code,
          language: 'cpp',
          theme: 'vs-light',
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'SF Mono, Monaco, monospace',
          lineNumbers: 'on',
          readOnly: true
        });
      }
    };
    
    loadMonaco();
    
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [code]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-[400px] bg-white/5 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
    >
      {(!code || code.trim() === '') ? (
        <div className="text-gray-300 text-sm flex items-center justify-center h-full bg-white/5 backdrop-blur-md">
          <div className="text-center">
            <p className="mb-2">Firmware code will appear here</p>
            <p className="text-xs text-gray-400">No firmware generated yet</p>
            <p className="text-xs text-gray-500 mt-2">Try generating a device with electronic components</p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-300 uppercase tracking-wider">Arduino Firmware</h3>
            <span className="text-xs text-gray-400">{code.split('\n').length} lines</span>
          </div>
          <pre className="text-xs font-mono text-gray-300 overflow-auto max-h-[320px] whitespace-pre-wrap bg-gray-900/50 p-3 rounded border border-white/10">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
}