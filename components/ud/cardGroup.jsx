'use client'
import React, { useEffect, useState } from 'react';
import InfoCard from '@/components/ud/InfoCard';
import { User, Shield, AlertCircle, Activity } from 'lucide-react';
import { Header } from '../dashboard/header';
import { getGuards } from '@/lib/database';
import { getClients } from '@/lib/clientsGateway';

export default function CardGroup() {

  const [guards, setGuards] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(()=> {
    async function fetchData(){
      const guards = await getGuards();
      console.log("Guards Data:", guards);
      setGuards(guards);

      const clients = await getClients();
      console.log("Clients Data: ", clients);
      setClients(clients)
    }

    fetchData()
  }, []);
  
  return (
    <div className="flex p-2 md:p-8 bg-white rounded-lg flex-col gap-6 overflow-hidden">
      <Header title={"Dashboard"}/>
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <InfoCard icon={User} count={guards.length} description="Active Guards" />
        <InfoCard icon={Shield} count={clients.length} description="Security Alerts" />
        <InfoCard icon={AlertCircle} count={12} description="Incidents Today" />
        <InfoCard icon={Activity} count={30} description="Daily Check-ins" />
      </div>
    </div>
  );
}
