"use client"
import React, { useEffect } from 'react'
import {Header} from '@/components/dashboard/header'
import RecentMessages from '@/components/dashboard/messages-panel'
import { LineGraph } from '@/components/charts/Line'
import { ChartGroup } from '@/components/dashboard/chartGroup'
import CardGroup from '@/components/ud/cardGroup'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation'



function Dashboard() {

  const {user} = useAuthStore();
  console.log(user)

  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 ">
        <ToastContainer />
        <div className='flex flex-col'>
          <CardGroup/>
          <div className='grid grid-cols-12 gap-2 md:gap-4 mt-8'>
            <RecentMessages/>
            <LineGraph/>
          </div>
        </div>
    </div>
  )
}

export default Dashboard