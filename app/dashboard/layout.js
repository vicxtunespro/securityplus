import NavBar from '@/components/dashboard/navbar'
import SideBar from '@/components/dashboard/navigation'
import { NavProvider } from '@/context/navContext'
import React from 'react'


export default function DashboardLayout({ children }) {
  return (
      <div className='h-screen flex overflow-hidden '>
        <SideBar/>
        <div className='w-full overflow-y-auto hide-scrollbar'>
          <NavBar/>
          <div className='px-2 md:px-8 py-16 w-full col-span-10'>
            {children}
          </div>
        </div>
      </div>
  )
}
