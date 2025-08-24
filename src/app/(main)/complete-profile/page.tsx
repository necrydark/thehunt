import CompleteProfileForm from '@/components/forms/complete-profile-form';
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import React from 'react'

export default async function ProfileCompletePage() {

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id;

  return (
    <div className="min-h-screen w-full relative">
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
      }}
    />
      <div className='w-full h-full relative z-10'>
      <div className='pt-[10rem] max-w-[800px] container mx-auto px-4'>
      <h1 className="text-primary-green text-4xl font-bold">Complete Your Profile</h1>
      <CompleteProfileForm userId={userId as string} completed={session?.user.profileCompleted as boolean} />
    </div>
      </div>
    </div>
  
  )
}
