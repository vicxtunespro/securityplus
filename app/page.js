'use client'
import useAuthStore from '@/store/authStore'

import React, { useEffect } from 'react'
import Link from 'next/link'
import LoadingPage from '../components/loadingPage';
import Nav from '@/components/home-nav';


export default function HomePage() {

  const checkAuthState = useAuthStore((state) => state.checkAuthState);

  useEffect(() => {
    checkAuthState(); // Check auth state when app loads
  }, []);

  return (
    <div className='px-4 md:px-16 lg:px-24 bg-main flex flex-col gap-8 py-8 text-xs'>
      <Nav/>
      <LoadingPage/>
    </div>
  )
}
