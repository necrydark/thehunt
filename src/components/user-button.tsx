"use client"
import { authClient } from "@/lib/auth-client"
import { User } from "better-auth"
import { LogOut, User2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"

type Props = {
  user?: User
}

export default function UserButton({user}: Props) {
  
  const router = useRouter();
 console.log("User",user)
  
 const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        }
      }
    })
  } 


  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user?.image || ""}/>
            <AvatarFallback className="bg-background text-primary-foreground">
              <User2 />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent  align="center" side="bottom" className="bg-[#BBFE17] border-black rounded-[5px]" sideOffset={15}>
        <p className="text-center text-black p-2">{user?.name}</p>
        <DropdownMenuSeparator className="bg-black" />
        <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer  rounded-[5px] text-black focus:bg-[#657e26] ">
              <Link className="text-black inline-flex items-center" href={`/profile/${user?.name}`}>
              <User2 className="mr-2 text-black" />
              
              Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer   rounded-[5px] text-black focus:bg-[#657e26] " onClick={handleSignOut}>
            <LogOut className=" text-black" /> Sign Out
            </DropdownMenuItem>
        </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
