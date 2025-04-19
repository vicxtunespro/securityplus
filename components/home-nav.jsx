import { ArrowDown01, Download, ShieldEllipsis } from 'lucide-react'
import React from 'react'

export default function Nav() {
  return (
    <div className='w-full flex justify-between items-center'>
        <ShieldEllipsis className='text-white size-8'/>
        <ul className='flex gap-8 text-xs text-background'>
            <li><a href='/dashboard'>Home</a></li>
            <li><a href='#'>Become a Member</a></li>
            <li><a href='#'>Register a Company</a></li>
            <li><a href='/auth/login'>Login</a></li>
            <li><a href='#'>Get a Quotation</a></li>
        </ul>
        <button className='bg-fuchsia-300 py-4 px-4 flex gap-4 rounded-md '> <Download className='size-4'/> Download Catalogue</button>
    </div>
  )
}
