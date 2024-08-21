import { formKeys, useDeleteForm } from '@/hooks/useForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';
import { Form } from '@prisma/client';
import { useNetworkStatus } from './networkStatusProvider';
import { set } from 'zod';

type Props = {}

function FormList({}: Props) {
  const { isOnline, wasOffline } = useNetworkStatus();
  const formsQuery = useQuery({
    queryKey: formKeys.list(),
    queryFn: async () => {
      return (await axios.get('/api/forms')).data;
    },
    staleTime: Infinity, // Keep data fresh indefinitely while offline
  });

  const deleteForm = useDeleteForm();
  const router = useRouter();

  if (formsQuery.isLoading) {
    return (
      <div className='flex flex-col space-y-4'>
        <Skeleton className='w-[400px] h-[80px] rounded-[14px] border' />
        <Skeleton className='w-[400px] h-[80px] rounded-[14px] border' />
        <Skeleton className='w-[400px] h-[80px] rounded-[14px] border' />
        <Skeleton className='w-[400px] h-[80px] rounded-[14px] border' />
      </div>
    );
  }

  if (formsQuery.isSuccess && formsQuery.data.length > 0) {
    const data = formsQuery.data;

    return (
      <div className='flex flex-col items-center space-y-4 max-h-[70svh] px-10 overflow-y-auto'>
        {formsQuery.data.length !== data.length && (
          <p>
            There is new data available, click{' '}
            <span
              onClick={() => {
                formsQuery.refetch();
              }}
              className='underline text-blue-500 hover:cursor-pointer'
            >
              here
            </span>{' '}
            to refresh data
          </p>
        )}
        {data.map((form: any) => (
          <div
            key={form.id}
            className='border px-4 py-2 rounded-[14px] bg-slate-100 shadow w-[400px]'
          >
            <div className='flex justify-between'>
              <div className='flex space-x-2'>
                <h2 className='font-bold'>{form.title}</h2>
                {form.id === undefined && (
                  <div className='flex space-x-2 bg-orange-400 border border-orange-500 px-3 rounded-full py-1'>
                    <p className='text-xs text-orange-700 font-bold'>
                      Pending
                    </p>
                  </div>
                )}
              </div>
              <div className='flex space-x-2'>
                <Edit
                  className='hover:cursor-pointer'
                  onClick={() => {
                    router.push(`/form/${form.id}`);
                  }}
                  size={16}
                />
                <Trash
                  className='hover:text-red-400 hover:cursor-pointer'
                  onClick={() => {
                    deleteForm.mutate(form.id);
                    toast.success('Form deleted successfully');
                  }}
                  size={16}
                />
              </div>
            </div>
            <p>{form.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default FormList;

