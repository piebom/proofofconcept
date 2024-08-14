"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import FormulierForm from '@/components/formulierForm'
import { useFormDetail } from '@/hooks/useForm'
import { ChevronLeft } from 'lucide-react'

type Props = {}

function FormCreate({ params }: { params: { id: string } }) {
    const {formQuery} = useFormDetail(params.id)
    if(formQuery.isLoading) return <div>Loading...</div>
    if(formQuery.isError) return <div>Error...</div>
    if(formQuery.data){
  return (
    <div className='h-screen w-screen p-12'>
        <Link className='flex items-center' href="/">
        <ChevronLeft className='mr-3' size={15} />
            go back
        </Link>
    <div className='flex justify-center flex-1 items-center container mx-auto'>
    <FormulierForm formData={formQuery.data}/>
    </div>

    </div>
  )
}
return null
}

export default FormCreate