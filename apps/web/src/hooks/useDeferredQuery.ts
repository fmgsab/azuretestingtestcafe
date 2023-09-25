import { useRef, useState } from 'react';
import { z, ZodTypeAny } from 'zod';

// TODO: cast with correct type
export function useDeferredQuery<T>({ router }: { router: z.infer<ZodTypeAny> }) {
  const [params, setParams] = useState<T | string>('');
  const paramsRef = useRef<T | string>(params);

  const { refetch, isRefetching } = router.useQuery(paramsRef.current, { enabled: false, retry: 3, retryDelay: 100 });

  const fetchData = (newParams: string) => {
    paramsRef.current = newParams;
    setParams(newParams);
    return refetch();
  };

  return [fetchData, isRefetching] as const;
}
