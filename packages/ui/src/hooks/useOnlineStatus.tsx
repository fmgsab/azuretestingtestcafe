import React, { useSyncExternalStore, useContext, createContext } from 'react';

// TODO: write and use ping service to detect online status, VPN connection causes false positives

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

const getSnapshot = () => navigator.onLine;

// keep internal
function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}

// exported for testing
export const OnlineStatusContext = createContext<boolean | undefined>(undefined);

export const useOnlineContext = () => useContext(OnlineStatusContext);

// only need to use this provider
export const OnlineStatusProvider = ({ children }: React.PropsWithChildren) => {
  const online = useOnlineStatus();
  return <OnlineStatusContext.Provider value={online}>{children}</OnlineStatusContext.Provider>;
};