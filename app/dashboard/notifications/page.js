"use client"; // Required for Next.js App Router

import { useEffect } from "react";
import { useNotificationStore } from "@/store/useNotificationStore"; // Adjust path if needed
import NotificationCard from "@/components/notification/notificationCard";
import SectionHeader from "@/components/dashboard/section-header";
import { Header } from "@/components/dashboard/header";

export default function Notifications() {
   const { users, subscribeToNewUsers } = useNotificationStore();

   useEffect(() =>{
    const unsubscribe = subscribeToNewUsers()

    return () => unsubscribe();
   }, [subscribeToNewUsers])

    return (
        <div>
            <Header title="Notifications" subtitle={"Don't miss any activity"}/>
            <ul>
                {users.map((user, index) => (
                    <NotificationCard user={user} key={index} />
                ))}
            </ul>
        </div>
    );
}
