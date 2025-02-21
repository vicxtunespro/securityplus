import React from 'react'
import MessageCard from './message-card'
import { CardHeader } from './header'

export default function RecentMessages() {
  return (
    <div className='flex flex-col gap-4 col-span-12 md:col-span-12 lg:col-span-4 bg-white p-8 rounded-lg'>
        <CardHeader title={"Recent Messages"}/>
        <div className="">
            <MessageCard
                user="John Doe"
                message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet purus nec orci ultrices tincidunt. Pellentesque habitant morbi tristique senectus et netus."
                status="Answered"
                time="Just now"
            />
            <MessageCard
                user="Jane Smith"
                message="This is a short message."
                status="Pending"
                time="30min ago"
            />
            <MessageCard
                user="Jane Smith"
                message="This is a short message."
                status="Pending"
                time="2hr ago"
            />
            <MessageCard
                user="Jane Smith"
                message="This is a short message."
                status="Pending"
                time="2hr ago"
            />
        </div>
    </div>
  )
}
