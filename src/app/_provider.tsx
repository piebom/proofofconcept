"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
export default function Provider({children}: {children: React.ReactNode}) {
    const persister = createSyncStoragePersister({
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      });
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                networkMode: 'offlineFirst'
            },
            mutations: {
                networkMode: 'offlineFirst'
            }
        }
    })

    return (
        <PersistQueryClientProvider persistOptions={{persister}} client={queryClient}
        onSuccess={() => queryClient.resumePausedMutations()}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    )
}