"use client";

import { Banknote, BookOpen, Home, Send, Swords, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Submissions",
    url: "/admin/submissions",
    icon: Send,
  },
  {
    title: "Items",
    url: "/admin/items",
    icon: Swords,
  },
  {
    title: "Bounties",
    url: "/admin/bounties",
    icon: Banknote,
  },
  {
    title: "Claims",
    url: "/admin/claims",
    icon: Send,
  },
  {
    title: "Back To Main",
    url: "/",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();

  return (
    <Sidebar className="bg-black border-r-primary-green">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={
                      pathname === item.url
                        ? "bg-primary-green !text-black rounded-md hover:bg-primary-green active:bg-primary-green"
                        : "bg-transparent text-white hover:bg-primary-green active:bg-primary-green !focus-visible:ring-0"
                    }
                    asChild
                    disabled={
                      session?.user.role === "Reviewer" &&
                      pathname !== "/admin/submissions"
                    }
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
