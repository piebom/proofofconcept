import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const formKeys = {
  all: () => ['forms'],
  list: () => [...formKeys.all(), 'list'],
  details: () => [...formKeys.all(), 'detail'],
  detail: (id: string) => [...formKeys.details(), id],
}
export const useCreateForm = () => {
    const queryClient = useQueryClient()

    // Create a new form
    const createFormMutation = useMutation({
        mutationKey: formKeys.all(),
        mutationFn: async (newForm) => {
            // Perform the API call to create the form
            const response = await axios.post('/api/forms', newForm)
            return response.data
        },
        onMutate: async (newForm) => {
            await queryClient.cancelQueries({ queryKey: formKeys.list() })
            const previousData = queryClient.getQueryData(formKeys.list())

            queryClient.setQueryData(formKeys.list(), old => [newForm, ...(old || [])])

            return { previousData }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(formKeys.list(), context!.previousData)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: formKeys.list() })
        },
    })

    return createFormMutation
}

export const useFormDetail = (formId: string) => {
  const queryClient = useQueryClient()

  const formQuery = useQuery({
    queryKey: formKeys.detail(formId),
    queryFn: async () => await axios.get(`/api/forms/${formId}`).then((res) => res.data),
  })

  const updateForm = useMutation({
    mutationKey: formKeys.detail(formId),
    mutationFn: async (updatedForm) => {
      // Perform the API call to update the form
      const response = await axios.put(`/api/forms/${formId}`, updatedForm)
      return response.data
    },
    onMutate: async (updatedForm) => {
      await queryClient.cancelQueries({ queryKey: formKeys.detail(formId) })
      const previousData = queryClient.getQueryData(formKeys.detail(formId))

      queryClient.setQueryData(formKeys.detail(formId), old => ({
        ...old,
        ...updatedForm,
      }))

      return { previousData }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(formKeys.detail(formId), context!.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(formId) })
    },
  })

  return {
    updateForm: updateForm.mutate,
    formQuery,
  }
}
