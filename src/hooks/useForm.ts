import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner';

export const formKeys = {
  all: () => ['forms'],
  list: () => [...formKeys.all(), 'list'],
  details: () => [...formKeys.all(), 'detail'],
  detail: (id: string) => [...formKeys.details(), id],
}

interface UpdateFormParams {
  id: string;
  updatedForm: {
      title: string;
      description: string;
      categoryId: string;
  };
}

interface CreateFormData {
  title: string;
  description: string;
  categoryId: string;
}

interface FormInputData {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const useUpdateForm = () => {
  const queryClient = useQueryClient();

  const updateFormMutation = useMutation({
      mutationKey: formKeys.all(),
      mutationFn: async ({ id, updatedForm }: UpdateFormParams) => {
          // Perform the API call to update the form
          const response = await axios.put(`/api/forms/${id}`, updatedForm);
          return response.data;
      },
      onMutate: async ({ id, updatedForm }: UpdateFormParams) => {
          await queryClient.cancelQueries({ queryKey: formKeys.list() });

          const previousData = queryClient.getQueryData(formKeys.list());

          // Optimistically update the query cache
          queryClient.setQueryData(formKeys.list(), (old: any) => 
              (old || []).map((form: any) =>
                  form.id === id ? { ...form, ...updatedForm } : form
              )
          );

          return { previousData };
      },
      onError: (error, _, context) => {
          // Roll back to previous state if mutation fails
          if (context?.previousData) {
              queryClient.setQueryData(formKeys.list(), context.previousData);
          }

          toast.error("An error occurred while updating the form");
      },
      onSettled: () => {
          // Invalidate queries to ensure data is fresh
          queryClient.invalidateQueries({ queryKey: formKeys.list() });
      },
      onSuccess: () => {
        toast.success('Form updated successfully');
      }
  });

  return updateFormMutation;
};

export const useCreateForm = () => {
    const queryClient = useQueryClient();

    // Create a new form
    const createFormMutation = useMutation({
        mutationKey: formKeys.all(),
        mutationFn: async (newForm: CreateFormData) => {
            // Perform the API call to create the form
            const response = await axios.post('/api/forms', newForm);
            return response.data;
        },
        onMutate: async (newForm: CreateFormData) => {
            await queryClient.cancelQueries({ queryKey: formKeys.list() });
            const previousData = queryClient.getQueryData<CreateFormData[]>(formKeys.list());

            queryClient.setQueryData<CreateFormData[]>(formKeys.list(), old => [newForm, ...(old || [])]);

            return { previousData };
        },
        onError: (_, __, context: { previousData: CreateFormData[] | undefined } | undefined) => {
            if (context?.previousData) {
                queryClient.setQueryData(formKeys.list(), context.previousData);
            }
            toast.error('An error occurred while creating the form');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: formKeys.list() });
        },
        onSuccess: () => {
          toast.success('Form created successfully');
        }
    });

    return createFormMutation;
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();

  // Delete a form
  const deleteFormMutation = useMutation({
      mutationKey: formKeys.all(),
      mutationFn: async (id: string) => {
          // Perform the API call to delete the form
          await axios.delete(`/api/forms/${id}`);
      },
      onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: formKeys.list() });

          const previousData = queryClient.getQueryData(formKeys.list());

          // Optimistically update the query cache
          queryClient.setQueryData(formKeys.list(), (old: any) => 
              (old || []).filter((form: any) => form.id !== id)
          );

          return { previousData };
      },
      onError: (error, id, context) => {
          // Roll back to previous state if mutation fails
          if (context?.previousData) {
              queryClient.setQueryData(formKeys.list(), context.previousData);
          }

          // Log error message to console
          console.error(error?.message || 'An error occurred');
      },
      onSettled: () => {
          // Invalidate queries to ensure data is fresh
          queryClient.invalidateQueries({ queryKey: formKeys.list() });
      },
  });

  return deleteFormMutation;
};

export const useFormDetail = (formId: string) => {
  const queryClient = useQueryClient();

  const formQuery = useQuery<FormInputData>({
    queryKey: formKeys.detail(formId),
    queryFn: async () => {
      const response = await axios.get(`/api/forms/${formId}`);
      return response.data;
    },
  });

  const updateForm = useMutation({
    mutationKey: formKeys.detail(formId),
    mutationFn: async (updatedForm: FormInputData) => {
      // Perform the API call to update the form
      const response = await axios.put(`/api/forms/${formId}`, updatedForm);
      return response.data;
    },
    onMutate: async (updatedForm: FormInputData) => {
      await queryClient.cancelQueries({ queryKey: formKeys.detail(formId) });
      const previousData = queryClient.getQueryData<FormInputData>(formKeys.detail(formId));

      queryClient.setQueryData<FormInputData>(formKeys.detail(formId), old => ({
        ...old,
        ...updatedForm,
      }));

      return { previousData };
    },
    onError: (_: unknown, __: unknown, context: { previousData: FormInputData | undefined } | undefined) => {
      if (context?.previousData) {
        queryClient.setQueryData(formKeys.detail(formId), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(formId) });
    },
  });

  return {
    updateForm: updateForm.mutate,
    formQuery,
  };
};
