'use client';

import { HistoryItem, GenerationOutput } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClearAll: () => void;
}

export default function HistoryDrawer({ 
  isOpen, 
  onClose, 
  history, 
  onLoadItem, 
  onClearAll 
}: HistoryDrawerProps) {
  
  const deleteHistoryItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this design?')) return;
    // Delete logic will be handled by parent
    // We need to emit this up
    const event = new CustomEvent('deleteHistoryItem', { detail: { id } });
    window.dispatchEvent(event);
  };
  
  return (
    <>
      <div 
        className={`fixed left-0 top-[60px] bottom-0 w-[280px] bg-white/95 backdrop-blur-md border-r border-white/20 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <h2 className="font-medium text-sm text-gray-600 uppercase tracking-wider">History</h2>
          <button onClick={onClose} className="p-1 hover:bg-emerald-50 rounded">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-auto h-[calc(100vh-60px)]">
          {history.length === 0 ? (
            <div className="p-6 text-sm text-gray-500 text-center">No designs yet</div>
          ) : (
            <>
              <div className="p-2">
                <button 
                  onClick={onClearAll} 
                  className="w-full py-2 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  Clear history
                </button>
              </div>
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative w-full text-left p-4 border-b border-white/10 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                  onClick={() => onLoadItem(item)}
                >
                  <div className="font-medium text-sm text-gray-900 truncate pr-8">{item.input}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleDateString()}</div>
                  <button 
                    onClick={(e) => deleteHistoryItem(item.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30" 
          style={{top: '60px'}} 
          onClick={onClose}
        />
      )}
    </>
  );
}