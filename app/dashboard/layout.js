import SideBar from '@/components/dashboard/navigation'
import React from 'react'


export default function DashboardLayout({ children }) {
  return (
    <div className='grid grid-cols-12'>
      <SideBar/>
      <div className='md:m-8 w-full '>
        {children}
      </div>
    </div>
  )
}
