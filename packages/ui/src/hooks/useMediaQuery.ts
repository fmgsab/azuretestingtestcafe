import { useCallback, useEffect, useState } from 'react';

// Inspired by usehooks-ts
// TODO: SSR safety
export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    return window?.matchMedia(query)?.matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  const handleChange = useCallback(() => {
    setMatches(getMatches(query));
  }, [query]);

  useEffect(() => {
    const matchMedia = window?.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    matchMedia?.addEventListener('change', handleChange);

    return () => {
      matchMedia?.removeEventListener('change', handleChange);
    };
  }, [handleChange, query]);

  return matches;
}
