import React from 'react'
import { Card } from '../ui/card'

export default function ChartGroup() {
  return (
    <div>
        <div className='grid grid-cols-2 gap-4'>
            <Card className='h-24'>Chart 1</Card>
            <Card className='h-24'>Chart 2</Card>
        </div>
    </div>
  )
}
