import React from 'react'
import CardGroup from '../ud/cardGroup'
import Navigation from '../dashboard/navigation'
import Header from '../dashboard/header'
import RecentMessages from '../dashboard/messages-panel'
import { ChartGroup } from '../dashboard/chartGroup'
import { Sidebar } from 'lucide-react'
import SideBar from '../dashboard/navigation'
import { LineGraph } from '../charts/Line'

function Dashboard() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 '>
        <div className='main-header bg-white col-span-12 h-12 fixed w-screen'>App Bar</div>
        <div className='main-content bg-[#FAF9FF] col-span-12 grid grid-cols-12'>
          <SideBar/>
          <div className='col-span-10 m-8 w-full flex flex-col gap-4 pt-12 overflow-y-scroll'>
            <Header title="Dashborad"/>
            <CardGroup/>
            <div className='flex gap-4'>
              <RecentMessages/>
              <LineGraph/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Dashboard