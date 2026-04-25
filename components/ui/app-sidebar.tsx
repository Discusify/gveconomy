"use client"
import { useSession } from "@/clientContext/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "../sidebar/nav-user"
import Link from "next/link"

type linkT = {
  title: string,
  href: string
}
const LINKS: linkT[] = [
  {
    title: "Home",
    href: "/"
  }
]

export function AppSidebar() {
  const {setOpen} = useSidebar()
  const {session, profile} = useSession()

  if (!session) {return null }
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {LINKS && LINKS.map((link) => {
              return <SidebarMenuItem key={link.title}>
              <SidebarMenuButton asChild>
                <Link href={link.href}>
                {link.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter >
        <NavUser user={{
          name: profile?.displayname || "",
          email: profile?.username || "",
          avatar: profile?.avatar_url || ""
        }}/>
      </SidebarFooter>
    </Sidebar>
  )
}