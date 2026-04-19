// HistoryDrawer.tsx - Update the props and add user section
interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClearAll: () => void;
  user?: any;
  userLoading?: boolean;
  userError?: string | null;
  designs?: any[];
  onLogout?: () => void;
}

export default function HistoryDrawer({ 
  isOpen, 
  onClose, 
  history, 
  onLoadItem, 
  onClearAll,
  user,
  userLoading,
  userError,
  designs,
  onLogout
}: HistoryDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
            {userLoading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : userError ? (
              <div className="text-sm text-red-500">{userError}</div>
            ) : user ? (
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                {(user.first_name || user.last_name) && (
                  <div className="text-sm text-gray-500">{user.first_name} {user.last_name}</div>
                )}
                {user.country && <div className="text-sm text-gray-500">{user.country}</div>}
                {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                <button 
                  onClick={onLogout}
                  className="mt-3 w-full px-3 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Not signed in</div>
            )}
          </div>
          
          {/* Designs Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Designs</h3>
            {userLoading ? (
              <div className="text-sm text-gray-500">Loading designs...</div>
            ) : !designs || designs.length === 0 ? (
              <div className="text-sm text-gray-500">No saved designs yet.</div>
            ) : (
              <ul className="space-y-2">
                {designs.map((d) => (
                  <li key={d.id} className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm text-gray-800 truncate">{d.input_text?.slice(0, 80) || 'Design'}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(d.timestamp).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* History Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Generation History</h3>
              {history.length > 0 && (
                <button 
                  onClick={onClearAll}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">
                No history yet. Generate a design to see it here.
              </div>
            ) : (
              <ul className="space-y-2">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onLoadItem(item)}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="text-sm text-gray-800 truncate">{item.prompt.slice(0, 60)}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}