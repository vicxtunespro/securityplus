'use client'
import useAuthStore from '@/store/authStore'

import React, { useEffect } from 'react'
import Link from 'next/link'


export default function HomePage() {

  const checkAuthState = useAuthStore((state) => state.checkAuthState);

  useEffect(() => {
    checkAuthState(); // Check auth state when app loads
  }, []);

  return (
    <div>
      <Link href={"/dashboard"}>Admins only</Link>
    </div>
  )
}
