import { Ellipsis } from 'lucide-react'
import React from 'react'

export function Header({title}) {
  return (
    <div className='flex flex-col gap-2'>
        <span className='font-semibold text-xl text-white'>{title}</span>
        <span className='text-xs text-[#CCCCCC]'>Welcome back!</span>
    </div>
  )
}

export function CardHeader({title}){
  return(
    <div className='flex justify-between items-center'>
        <span className='font-semibold text-lg'>{title}</span>
        <Ellipsis className='text-slate-200'></Ellipsis>
    </div>
  )
}