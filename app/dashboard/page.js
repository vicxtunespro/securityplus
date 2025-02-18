import React from 'react'
import {Header} from '@/components/dashboard/header'
import RecentMessages from '@/components/dashboard/messages-panel'
import { LineGraph } from '@/components/charts/Line'
import { ChartGroup } from '@/components/dashboard/chartGroup'
import CardGroup from '@/components/ud/cardGroup'


function Dashboard() {
  return (
    <div className="flex flex-col gap-8 bg-red-200 overflow-y-scroll">
        <div className='flex flex-col'>
          <CardGroup/>
          <div className='grid grid-cols-12 gap-4 mt-8'>
            <RecentMessages/>
            <LineGraph/>
            <LineGraph/>
          </div>
        </div>
    </div>
  )
}

export default Dashboard