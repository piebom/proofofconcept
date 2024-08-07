import { useForms } from '@/hooks/useForm'
import React from 'react'

type Props = {}

function FormList({}: Props) {
    const { data: allFormsQuery } = useForms()

  return (
    <div className='flex flex-col space-y-4'>
        {allFormsQuery?.map((form: any) => (
            <div key={form.id} className='border px-4 py-2 rounded-[14px] bg-slate-100 shadow'>
            <h2>{form.title}</h2>
            <p>{form.description}</p>
            </div>
        ))}
    </div>
  )
}

export default FormList