"use client"
import { authClient } from '@/lib/auth-client'
import { Twitch } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export default function LoginForm() {

  const signInWithTwitch = async () => {
    await authClient.signIn.social({
      provider: "twitch",
      callbackURL: "/dashboard"
    })
  }

  return (
    <div>
        <Card>
          <CardHeader>
            <CardTitle>Login into your account.</CardTitle>
            <CardDescription>Click the button below to login into your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex justify-center items-center'>
                <Button
                className='w-full bg-[#9146FF] hover:bg-[#9146FF]/75 duration-300 transition-all'
                type="button"
                onClick={signInWithTwitch}>
                  <Twitch className='h-4 w-4 mr-2' />
                  Login With Twitch
                </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
