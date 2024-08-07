"use client";
import { Form } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface FormParams {
  title: string;
  category: string;
  description: string;
}

const onMutate = async (params: FormParams) => {
  const { title, category, description } = params;

  const response = await axios.post(
    `/api/forms`,
    {
      title,
      category: parseInt(category, 10), // Ensure category is parsed to an integer
      description,
    }
  );

  return response.data;
};

const useForms = () => {
  return useQuery<Form[], unknown>({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await axios.get('/api/forms');
      return response.data;
    },
  });
};

const useCreateForm = () => {
  const queryClient = useQueryClient(); // Use inside the hook

  return useMutation<Form, unknown, FormParams>({
    mutationFn: onMutate,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] }); 
    },
  });
};

export { useCreateForm, useForms };
