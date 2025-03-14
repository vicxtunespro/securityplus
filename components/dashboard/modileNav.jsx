'use client'
import React, { useState } from 'react'
import Link from 'next/link';
import { Bell, LayoutDashboard, Search, Settings, Shield, User, Users,  } from 'lucide-react';

export default function MobileNavBar() {
  const [activeIndex, setActiveIndex] = useState(null); // Track the active menu

  const handleClick = (index) => {
    setActiveIndex(index); // Set the clicked icon as active
  };

  return (
    <div className='grid grid-cols-5 place-items-center h-20 rounded-t-[1.5rem] bg-slate-100 fixed bottom-0 w-screen md:hidden z-10 overflow-hidden shadow-inner'>
      <Link
        href={"/dashboard"} 
        className={`menu-icon col-span-1 flex flex-col justify-center items-center text-xs ${activeIndex === 0 ? 'active-menu-icon bg-blue-500 rounded-full text-white p-4' : ''}`}
        onClick={() => handleClick(0)}
      >
        <LayoutDashboard size={20}/>
        <p className={`label ${activeIndex === 0 ? 'hidden' : ''}`}>Dashboard</p>
      </Link>
      <Link
        href={"#"}
        className={`menu-icon col-span-1 flex flex-col justify-center items-center text-xs ${activeIndex === 1 ? 'active-menu-icon bg-blue-500 rounded-full text-white' : ''}`}
        onClick={() => handleClick(1)}
      >
        <Search size={20}/>
        <p className={`label ${activeIndex === 1 ? 'hidden' : ''}`}>Search</p>
      </Link>
      <Link
        href={"/dashboard/officers"}
        className={`menu-icon col-span-1 flex flex-col justify-center items-center text-xs ${activeIndex === 2 ? 'active-menu-icon bg-blue-500 rounded-full text-white p-4' : ''}`}
        onClick={() => handleClick(2)}
      >
        <Shield size={20}/>
        <p className={`label ${activeIndex === 2 ? 'hidden' : ''}`}>Officers</p>
      </Link>
      <Link
      href={"/dashboard/clients"}
        className={`menu-icon col-span-1 flex flex-col justify-center items-center text-xs ${activeIndex === 3 ? 'active-menu-icon bg-blue-500 rounded-full text-white p-4' : ''}`}
        onClick={() => handleClick(3)}
      >
        <Users size={20}/>
        <p className={`label ${activeIndex === 3 ? 'hidden' : ''}`}>Clients</p>
      </Link>
      <Link
        href={"/dashboard/notifications"}
        className={`menu-icon col-span-1 flex flex-col justify-center items-center text-xs ${activeIndex === 4 ? 'active-menu-icon bg-blue-500 rounded-full text-white p-4' : ''}`}
        onClick={() => handleClick(4)}
      >
        <Bell size={20}/>
        <p className={`label ${activeIndex === 4 ? 'hidden' : ''}`}>Notifications</p>
      </Link>
    </div>
  );
}
