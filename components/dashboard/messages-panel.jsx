import React from 'react'
import MessageCard from './message-card'

export default function RecentMessages() {
  return (
    <div className='flex flex-col gap-4 w-1/2'>
        <h1 className='font-semibold '>Recent Messages</h1>
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
