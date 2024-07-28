import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import FormulierForm from '@/components/formulierForm'

type Props = {}

function FormCreate({}: Props) {
  return (
    <>
    <Link href="/">
        Home
    </Link>
    <FormulierForm/>
    </>
  )
}

export default FormCreate