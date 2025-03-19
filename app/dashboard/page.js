"use client"
import React, { useEffect } from 'react'
import {Header} from '@/components/dashboard/header'
import RecentMessages from '@/components/dashboard/messages-panel'
import { LineGraph } from '@/components/charts/Line'
import { ChartGroup } from '@/components/dashboard/chartGroup'
import CardGroup from '@/components/ud/cardGroup'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from 'next/navigation'


function Dashboard() {

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(()=> {
    const message = searchParams.get('message');
    if(message === "unauthorised"){
      toast.error("Admins are not allowed to visit clients pages.", {
        autoClose: 10000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }, [searchParams]);

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