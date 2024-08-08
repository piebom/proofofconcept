import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import FormulierForm from '@/components/formulierForm'
import { ChevronLeft } from 'lucide-react'

type Props = {}

function FormCreate({}: Props) {
  return (
    <div className="flex flex-1 w-full flex-col justify-center items-center p-12 space-y-6">
      <div className='flex justify-start items-center w-full'>
        <Link className='flex justify-start  items-center' href="/">
        <ChevronLeft className='mr-3' size={15} />
            go back
        </Link>
        </div>
    <div className='flex justify-center flex-1 items-center container mx-auto'>
    <FormulierForm/>
    </div>

    </div>
  )
}

export default FormCreate