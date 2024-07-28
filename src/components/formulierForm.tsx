"use client"
import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'

type Props = {}

function FormulierForm({}: Props) {
  return (
    <Button onClick={() => {
        toast.success('Formulier is ingevuld!');
    }}>
        Submit
    </Button>
  )
}

export default FormulierForm