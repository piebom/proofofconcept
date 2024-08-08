"use client"
import React from 'react'
import { Button } from './ui/button'
import { useNetworkStatus } from './networkStatusProvider'
import { WifiOff } from 'lucide-react'

type Props = {}

function Header({}: Props) {
    const {isOnline} = useNetworkStatus()
  return (
    <div className='w-full bg-slate-100 border-b border-b-slate-200 shadow h-[60px] flex items-center justify-center'>
     
        <h1 className='text-2xl font-bold text-slate-800'>Proof Of Concept</h1>
        {!isOnline && (
        <div className='absolute right-10 flex space-x-2'>
<WifiOff size={24} />
            <p>You are currently offline</p>

            </div>
                    )}
    </div>
  )
}

export default Header