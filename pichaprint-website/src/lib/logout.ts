// Lightweight logout helper that clears local auth state and performs a hard redirect
export async function logoutAndRedirect(redirectUrl = 'https://picha-print-ai.vercel.app') {
  try {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pichaprint_token');
      } catch (e) {
        // ignore
      }

      try {
        // also clear legacy key if present
        localStorage.removeItem('access_token');
      } catch (e) {}

      // Best-effort: remove local IndexedDB used by storage service to avoid stale UI
      try {
        if (typeof indexedDB !== 'undefined') {
          const del = indexedDB.deleteDatabase('pichaprint_db');
          // Don't await; just trigger deletion
          del.onsuccess = () => {};
          del.onerror = () => {};
        }
      } catch (e) {}

      // Use replace to avoid adding a history entry and causing loops
      window.location.replace(redirectUrl);
    }
  } catch (err) {
    try {
      window.location.href = redirectUrl;
    } catch (e) {
      // last resort noop
    }
  }
}
