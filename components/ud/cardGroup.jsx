import React from 'react';
import InfoCard from '@/components/ud/InfoCard';
import { User, Shield, AlertCircle, Activity } from 'lucide-react';
import { Header } from '../dashboard/header';

export default function CardGroup() {
  return (
    <div className="flex p-8 bg-[url('/bg.jpg')] rounded-lg flex-col gap-6 overflow-hidden">
      <Header title={"Dashboard"}/>
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <InfoCard icon={User} count={250} description="Active Users" />
        <InfoCard icon={Shield} count={75} description="Security Alerts" />
        <InfoCard icon={AlertCircle} count={12} description="Incidents Today" />
        <InfoCard icon={Activity} count={30} description="Daily Check-ins" />
      </div>
    </div>
  );
}
