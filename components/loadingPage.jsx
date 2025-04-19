import { Footprints, LucideLogIn, ShieldAlert, TrainTrack, UserPlus,  Rocket } from 'lucide-react'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className='h-screen w-full'>
        <div className='grid grid-cols-8 gap-8'>
            <div className=' flex gap-12 flex-col col-span-8 md:col-span-4 w-full h-96 bg-gradient-to-br from-main to-blue-500 rounded-lg p-16'>
              <div className='flex gap-12'>
                <div className='text-gray-100'>
                  <p className='text-lg text-gray-400 font-light'>We Secure you !</p>
                  <p className='text-3xl font-semibold my-4 '>Security Plan</p>
                  <p className='text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis minima quaerat doloribus, quo corrupti nam, aliquam sint vero accusantium possimus fugit fuga voluptatem, perferendis incidunt quae dolor tenetur consequuntur soluta.</p>
                </div>
                <span className='h-full '><ShieldAlert className='size-24 text-background'/></span>
              </div>
              <div className='w-full flex gap-4'>
                <button className='py-4 px-4 bg-sub text-gray-200 md:w-1/2 w-full rounded-md flex items-center justify-center gap-2 '><LucideLogIn className='size-4'/><a href="/auth/login">Log into your account</a></button>
                <button className='py-4 px-4 bg-main text-gray-200 md:w-1/2 w-full rounded-md flex items-center justify-center gap-2 '><UserPlus className='size-4'/>Create account</button>
              </div>
            </div>
            <div className=' flex gap-12 flex-col col-span-8 md:col-span-4 w-full h-96 bg-gradient-to-br from-blue-500 to-main rounded-lg p-16'>
              <div className='flex gap-12'>
                <div className='text-gray-100'>
                  <p className='text-lg text-gray-400 font-light'>Tracked and Monitored!</p>
                  <p className='text-3xl font-semibold my-4 '>No Worries</p>
                  <p className='text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis minima quaerat doloribus, quo corrupti nam, aliquam sint vero accusantium possimus fugit fuga voluptatem, perferendis incidunt quae dolor tenetur consequuntur soluta.</p>
                </div>
                <span className='h-full '><Footprints className='size-24 text-background'/></span>
              </div>
              <div className='w-full flex gap-4'>
                <button className='py-4 px-4 bg-sub text-gray-200 md:w-1/2 w-full rounded-md flex items-center justify-center gap-2 '><LucideLogIn className='size-4'/>Create your own plan</button>
                
              </div>
            </div>
            
            <div className='flex justify-center items-center gap-16 col-span-8 w-full h-fit bg-gradient-to-br from-main to-blue-500 rounded-lg p-8'>
                <div className='text-gray-100'>
                  <p className='text-lg text-gray-400 font-light'>Without accout you can still be served</p>
                  <p className='text-3xl font-semibold my-4 '>Trust us with that Security Job</p>
                  <p className='text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis minima quaerat doloribus, quo corrupti nam, aliquam sint vero accusantium possimus fugit fuga voluptatem, perferendis incidunt quae dolor tenetur consequuntur soluta.</p>
                </div>
                <button className='py-4 px-4 h-16 w-48 bg-main text-gray-200 md:w-1/2 rounded-md flex items-center justify-center gap-2' > <Rocket /> View Quicky Services</button>
            </div>
        </div>
    </div>
  )
}
