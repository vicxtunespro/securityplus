import CardGroup from '@/components/ud/cardGroup'
import InfoCard from '@/components/ud/InfoCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, MailIcon, Loader2, User } from "lucide-react"

import React from 'react'
import Link from 'next/link'


export default function HomePage() {
  return (
    <div className='overflow-hidden'>
      <Link href={"/dashboard"}>Admins only</Link>
    </div>
  )
}
