import React from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import { useCreateForm, useUpdateForm } from '@/hooks/useForm';
import { useCategoryData } from '@/hooks/useCategories';

export const formSchema = z.object({
  title: z.string().min(1).max(255, 'Title must be at most 255 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1).max(255, 'Description must be at most 255 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface FormulierFormProps {
  formData?: {
    id: string;
    title: string;
    categoryId: string;
    description: string;
  };
}

function FormulierForm({ formData }: FormulierFormProps) {
  const { data, status, error } = useCategoryData();
  const router = useRouter();
  const createForm = useCreateForm();
  const updateForm = useUpdateForm();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData ? formData.title : '',
      category: formData ? formData.categoryId.toString() : '1',
      description: formData ? formData.description : '',
    },
  });

  const onSubmit = (values: FormValues) => {
    if (formData) {
      updateForm.mutate({
        id: formData.id,
        updatedForm: values,
      });
      router.push('/');
      toast.success('Form updated successfully');
    } else {
      createForm.mutate(values);
      router.push('/');
      toast.success('Form created successfully');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              {status === 'pending' && <p>Loading categories...</p>}
              {status === 'error' && <p>Error loading categories</p>}
              {status === 'success' && data && data.length > 0 && (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.map((category: { id: string; name: string }) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default FormulierForm;
