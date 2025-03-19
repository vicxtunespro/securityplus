import React from 'react'
import MessageCard from './message-card'
import { CardHeader } from './header'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useEffect } from 'react'

export default function RecentMessages() {
    const {users, subscribeToNewUsers } = useNotificationStore()

    useEffect(() =>{
        const unsubscribe = subscribeToNewUsers()
    
        return () => unsubscribe();
       }, [subscribeToNewUsers])

  return (
    <div className='flex flex-col gap-4 col-span-12 md:col-span-12 lg:col-span-4 bg-white p-8 rounded-lg'>
        <CardHeader title={"New Accounts"}/>
        <div className="flex flex-col gap-1">
           { users.slice(0, 5).map((user, index) => (
            <MessageCard
            key={index}
            user={user}
            />
           ))}
        </div>
    </div>
  )
}
