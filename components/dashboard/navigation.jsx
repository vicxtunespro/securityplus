import { Home, Settings, Bell, User, LogOut } from 'lucide-react'
import React from 'react'
import NavItem from './nav-item'

export default function Navigation() {
  return (
    <div className='h-[100vh] bg-[#5A57FF] fixed w-[200px] z-20'>
        <div className='flex flex-col h-full relative'>
            <div className='flex items-center gap-2 text-white text-[16px] font-semibold mb-[64px] justify-center py-4'>
                <div className='w-8 h-8 border-white border-[10px]'></div>
                <div>Square</div>
            </div>
            <ul>
                <NavItem icon={Home} label="Dashboard" />
                <NavItem icon={Settings} label="Settings" />
                <NavItem icon={Bell} label="Notifications" />
                <NavItem icon={User} label="Profile" />
            </ul>
            <ul className='absolute bottom-0 w-full mb-8'>
                <NavItem icon={Settings} label="Settings" />
                <NavItem icon={LogOut} label="Logout" />
            </ul>
        </div>
    </div>
  )
}
