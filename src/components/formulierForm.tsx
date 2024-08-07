"use client"
import React from 'react'
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
import { useCreateForm } from '@/hooks/useForm'
import { useRouter } from 'next/navigation'

export const formSchema = z.object({
  title: z.string().min(1).max(255, "Title must be at most 255 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1).max(255, "Description must be at most 255 characters"),
});


function FormulierForm() {
  const { data, status, error } = useCategoryData();
  const router = useRouter();
  const createForm = useCreateForm()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: data?.[0].id,
      description: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
   const response = createForm.mutate(values, {
    onSuccess: () => {
      toast.success("Form created successfully")
      router.push("/")
    }
   })
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
                  {data?.map((category:any) => (
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