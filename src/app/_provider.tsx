"use client"
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from "axios"
import { toast } from "sonner"
import { formKeys } from "@/hooks/useForm"
export default function Provider({children}: {children: React.ReactNode}) {
    const persister = createSyncStoragePersister({
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      });
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 2000,
            retry: 0,
          },
        },
        // configure global cache callbacks to show toast notifications
        mutationCache: new MutationCache({
          onSuccess: (data:any) => {
            toast.success(data.message)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }),
      })

    queryClient.setMutationDefaults(formKeys.all(), {
        mutationFn: async ({ id, comment }) => {
            await queryClient.cancelQueries({ queryKey: formKeys.detail(id) })
            return axios.post(`/api/forms/${id}`, { comment }).then((res) => res.data)
          },
    })

    return (
        <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
        onSuccess={() => {
          // resume mutations after initial restore from localStorage was successful
          queryClient.resumePausedMutations().then(() => {
            queryClient.invalidateQueries()
          })
        }}
      >
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    )
}