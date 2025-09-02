"use client";
import { User } from "better-auth";
import { LogOut, Paperclip, Shield, User2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type UserProps = {
  user: User & {
    role?: string;
  };
  onSignOut: () => void;
};

export default function UserDropdown({ user, onSignOut }: UserProps) {
  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-background text-primary-green-foreground">
              <User2 />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          side="bottom"
          className="bg-[#BBFE17] border-black rounded-[5px]"
          sideOffset={15}
        >
          <p className="text-center text-black p-2">{user?.name}</p>
          <DropdownMenuSeparator className="bg-black" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer  rounded-[5px] text-black focus:bg-[#657e26] ">
              <Link
                className="text-black inline-flex items-center"
                href={`/dashboard`}
              >
                <User2 className="mr-2 text-black" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            {user.role === "Admin" && (
              <DropdownMenuItem className="cursor-pointer  rounded-[5px] text-black focus:bg-[#657e26] ">
                <Link
                  className="text-black inline-flex items-center"
                  href={`/admin`}
                >
                  <Shield className="mr-2 text-black" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            {(user.role === "Reviewer" || user.role === "Admin") && (
              <DropdownMenuItem className="cursor-pointer  rounded-[5px] text-black focus:bg-[#657e26] ">
                <Link
                  className="text-black inline-flex items-center"
                  href={`/admin/submissions`}
                >
                  <Paperclip className="mr-2 text-black" />
                  Submissions
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer   rounded-[5px] text-black focus:bg-[#657e26] "
              onClick={onSignOut}
            >
              <LogOut className=" text-black" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
