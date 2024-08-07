import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import FormulierForm from '@/components/formulierForm'

type Props = {}

function FormCreate({}: Props) {
  return (
    <div className='h-screen w-screen'>
    <Link href="/">
        Home
    </Link>
    <div className='flex justify-center flex-1 items-center container mx-auto'>
    <FormulierForm/>
    </div>

    </div>
  )
}

export default FormCreate