"use client"
import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from './ui/textarea'
import { useQuery } from '@tanstack/react-query'
import { useCategoryData } from '@/hooks/useCategories'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreateForm, useFormDetail, useUpdateForm } from '@/hooks/useForm'

export const formSchema = z.object({
  title: z.string().min(1).max(255, "Title must be at most 255 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1).max(255, "Description must be at most 255 characters"),
});


function FormulierForm({formData}: {formData?: any}) {
  const { data, status, error } = useCategoryData();
  const router = useRouter();
  const createForm = useCreateForm()
  const updateForm = useUpdateForm()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData ? formData.title : '',
      category: formData ? formData.categoryId.toString() : "1",
      description: formData ? formData.description : '',
    },
  })

  // useEffect(() => {
  //   form.reset({
  //     title: formData ? formData.title : '',
  //     category: formData ? formData.category.id.toString() : data?.[0].id.toString(),
  //     description: formData ? formData.description : '',
  //   })
  // }, [formData])
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    if(formData) {
      updateForm.mutate({
        id: formData.id,
        updatedForm: values
      })
      router.push('/')
      toast.success('Form updated successfully')
    }
    else{
      createForm.mutate(values)
      router.push('/')
      toast.success('Form created successfully')
    }
  }

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.length > 0 && data?.map((category:any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
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
  )
}

export default FormulierForm