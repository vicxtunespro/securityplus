import React from 'react'
import CardGroup from '../ud/cardGroup'
import ChartGroup from '../ud/chartGroup'
import Navigation from '../dashboard/navigation'
import Header from '../dashboard/header'
import RecentMessages from '../dashboard/messages-panel'

function Dashboard() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12'>
        <div className='main-header bg-white col-span-12 h-12 fixed w-screen z-10'>App Bar</div>
        <div className='main-content bg-[#FAF9FF] col-span-12 flex overflow-y-scroll'>
          <div className='aside w-[250px] z-20'>
            <Navigation/>
          </div>
          <div className=' col-span-10 m-8 w-full flex flex-col gap-4 pt-12 overflow-auto'>
            <Header title="Dashborad"/>
            <CardGroup/>
            <RecentMessages/>
          </div>
        </div>
    </div>
  )
}

export default Dashboard