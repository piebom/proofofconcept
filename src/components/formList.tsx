import { formKeys } from '@/hooks/useForm'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'

type Props = {}

function FormList({}: Props) {
    const moviesQuery = useQuery({
        queryKey: formKeys.list(),
        queryFn: async () => {
           return (await axios.get('/api/forms')).data
        }
      })

      if (moviesQuery.isLoading) {
        return 'Loading...'
      }

      if(moviesQuery.data)
{    
  return (
    <div className='flex flex-col space-y-4'>

        {moviesQuery.data?.map((form: any) => (
            <div key={form.id} className='border px-4 py-2 rounded-[14px] bg-slate-100 shadow w-[400px]'>
                <div className='flex justify-between'>
            <h2 className='font-bold'>{form.title}</h2>
            {form.id === undefined && (
            <div className='flex space-x-2 bg-orange-400 border border-orange-500 px-3 rounded-full py-1'>
                <p className='text-xs text-orange-700 font-bold'>Pending</p>
                </div>
            )}
                </div>
            <p>{form.description}</p>
            </div>
        ))}
    </div>
  )
}
return null
}

export default FormList