'use client';

import { useEffect, useRef, useState } from 'react';
// Dynamically import JointJS to avoid SSR issues
let joint: any = null;

interface CircuitData {
  nodes?: Array<{ id: string; label?: string; x?: number; y?: number }>;
  connections?: Array<{ source: string; target: string; label?: string }>;
}

interface CircuitViewerProps {
  circuitData: CircuitData | null;
}

export default function CircuitViewer({ circuitData }: CircuitViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jointReady, setJointReady] = useState(false);
  
  useEffect(() => {
    // Load JointJS dynamically
    const loadJoint = async () => {
      if (typeof window !== 'undefined' && !joint) {
        try {
          const jointModule = await import('jointjs');
          joint = jointModule;
          setJointReady(true);
        } catch (err) {
          console.error('Failed to load JointJS:', err);
        }
      } else if (joint) {
        setJointReady(true);
      }
    };
    
    loadJoint();
  }, []);
  
  useEffect(() => {
    if (!jointReady || !circuitData || !containerRef.current) return;
    if (!circuitData.nodes || !Array.isArray(circuitData.nodes)) return;
    
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 400;
    container.innerHTML = '';
    
    try {
      const graph = new joint.dia.Graph();
      const paper = new joint.dia.Paper({
        el: container,
        model: graph,
        width: width,
        height: height,
        gridSize: 10,
        drawGrid: { name: 'dot', args: { color: '#f0f0f0' }},
        background: { color: '#fff' }
      });
      
      const elements: Record<string, any> = {};
      
      circuitData.nodes.forEach((node, idx) => {
        const rect = new joint.shapes.standard.Rectangle();
        rect.position(node.x || (idx * 150 + 50), node.y || 100);
        rect.resize(120, 60);
        rect.attr({
          body: { fill: '#fff', stroke: '#333', strokeWidth: 1.5, rx: 6, ry: 6 },
          label: { text: node.label || node.id, fill: '#111', fontSize: 11, fontFamily: 'Inter, sans-serif' }
        });
        rect.addTo(graph);
        elements[node.id] = rect;
      });
      
      if (circuitData.connections?.forEach) {
        circuitData.connections.forEach(conn => {
          if (elements[conn.source] && elements[conn.target]) {
            new joint.shapes.standard.Link({
              source: { id: elements[conn.source].id },
              target: { id: elements[conn.target].id },
              attrs: { 
                line: { 
                  stroke: '#666', 
                  strokeWidth: 1.5, 
                  targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 z', fill: '#666' }
                }
              },
              labels: conn.label ? [{ position: 0.5, attrs: { text: { text: conn.label, fill: '#666', fontSize: 10 } }}] : []
            }).addTo(graph);
          }
        });
      }
      
      const contentRect = graph.getBBox();
      if (contentRect.width > 0) {
        const padding = 50;
        const scale = Math.min((width - padding * 2) / contentRect.width, (height - padding * 2) / contentRect.height, 1);
        paper.scale(scale, scale);
        paper.translate((width - contentRect.width * scale) / 2 - contentRect.x * scale, (height - contentRect.height * scale) / 2 - contentRect.y * scale);
      }
      
      const handleResize = () => {
        if (!containerRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        paper.setDimensions(newWidth, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        paper.remove();
      };
    } catch (err) {
      console.error('Circuit rendering error:', err);
      container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-sm">Failed to render circuit</div>';
    }
  }, [jointReady, circuitData]);
  
  if (!jointReady) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-white/5 backdrop-blur-md rounded-xl border border-white/20">
        <span className="text-gray-300 text-sm">Loading circuit viewer...</span>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      id="circuit-container" 
      className="w-full h-[400px] bg-white/5 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
    >
      {!circuitData && (
        <span className="text-gray-300 text-sm flex items-center justify-center h-full">
          Circuit diagram will appear here
        </span>
      )}
    </div>
  );
}