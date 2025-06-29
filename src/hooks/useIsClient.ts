// src/hooks/useIsClient.ts

import { useEffect, useState } from 'react';

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only runs on client after hydration
  }, []);

  return isClient;
}
