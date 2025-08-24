'use client'
import { completeProfileSchema } from '@/app/schemas/schema'
import { api } from '@/lib/trpc/client'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { setTimeout } from 'timers'
import * as z from "zod"
import { Card, CardContent } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'


type CompleteProfileValues = z.infer<typeof completeProfileSchema>
type Props = {
    userId: string;
    completed?: boolean
}

export default function CompleteProfileForm({userId, completed}: Props) {
    const router = useRouter();
    const utils = api.useUtils();

    if(completed) {
        redirect("/dashboard")
    }

    const completeFormMutation = api.user.complete.useMutation({
        onSuccess: async () => {
            toast("Profile Completed Succesfully");
            await utils.user.invalidate();
            setTimeout(() => {
                router.push("/dashboard")
            }, 500);
        },
        onError: (err) => {
            toast.error("Failed to complete profile. Please try again");
            console.error("Complete profile error:", err);
        }
    })

    const handleSubmit = (data: CompleteProfileValues) => {
        completeFormMutation.mutate({
            userId: userId,
            platform: data.platform,
            vaultHunter: data.vaultHunter
        });
    };

    const form = useForm<CompleteProfileValues>({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            platform: "",
            vaultHunter: ""
        }
    })

  return (
    <Card
    className="border max-w-[800px] border-white/10 mt-8 shadow-md shadow-primary-green rounded-xl p-6 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group"
    >
        <CardContent className='space-y-4'>
            <div className='flex flex-col'>
                <Form {...form}>
                    <form 
                    className='space-y-6'
                    onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <div className='flex  w-full  space-x-4'>
                        <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem className='w-1/2'>
                          <FormLabel className="text-white">Platform</FormLabel>
                          <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          >
                            <FormControl className='w-full'>
                                <SelectTrigger className='border-primary-green text-white'>
                                    <SelectValue placeholder="Select your platform" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className='bg-black border-primary-green'>
                            <SelectItem
                            className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                            value="PC"
                          >
                            PC
                          </SelectItem>
                          <SelectItem
                            className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                            value="Playstation"
                          >
                            Playstation
                          </SelectItem>
                          <SelectItem
                            className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                            value="XBOX"
                          >
                            XBOX
                          </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vaultHunter"
                      render={({ field }) => (
                        <FormItem className='w-1/2'>
                        <FormLabel className="text-white">Vault Hunter</FormLabel>
                        <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        >
                          <FormControl className='w-full'>
                              <SelectTrigger className='border-primary-green text-white'>
                                  <SelectValue placeholder="Select your vault hunter" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent className='bg-black border-primary-green'>
                          <SelectItem
                          className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                          value="Moze"
                        >
                          Moze
                        </SelectItem>
                        <SelectItem
                          className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                          value="FL4K"
                        >
                          FL4K
                        </SelectItem>
                        <SelectItem
                          className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                          value="Zane"
                        >
                          Zane
                        </SelectItem>
                        <SelectItem
                          className="focus:bg-primary-green text-white focus:text-black active:bg-primary-green active:text-black"
                          value="Amara"
                        >
                          Amara
                        </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                      )}
                    />
                        </div>
                            <div className="flex justify-end">
                  <Button
                    className="bg-primary-green hover:bg-primary-green/75 hover:shadow-md hover:shadow-primary-green/50 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                    type="submit"
                    disabled={completeFormMutation.isPending || completeFormMutation.isSuccess}
                  >
                    {completeFormMutation.isPending ? "Completing..." : "Complete Profile"}
                  </Button>
                </div>
                    </form>
                </Form>
            </div>
        </CardContent>

    </Card>
  )
}
