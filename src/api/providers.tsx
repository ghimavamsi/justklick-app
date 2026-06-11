import { QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';

import { queryClient } from './query-client';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
