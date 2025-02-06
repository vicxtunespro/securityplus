import React from 'react'

export default function Header({title}) {
  return (
    <div className='flex flex-col gap-2'>
        <span className='font-black text-xl'>{title}</span>
        <span className='text-xs text-[#CCCCCC]'>Welcome back!</span>
    </div>
  )
}
