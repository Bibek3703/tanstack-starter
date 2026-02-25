import {
    BookmarkIcon,
    LayoutDashboardIcon,
    Settings2,
    User2Icon,
} from "lucide-react"

import { NavUser } from "@/components/web/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Link, linkOptions } from "@tanstack/react-router"
import NavPrimary, { NavPrimaryItemType } from "./nav-primary"
import { getSession } from "@/data/session"
import { Skeleton } from "../ui/skeleton"
import { Suspense } from "react"


const navItems: NavPrimaryItemType[] = linkOptions([
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboardIcon,
        activeOptions: { exact: true },
    },
    {
        title: "Todos",
        to: "/dashboard/todos",
        icon: BookmarkIcon,
        activeOptions: { exact: false },
    },
    {
        title: "Profile",
        to: "/dashboard/profile",
        icon: User2Icon,
        activeOptions: { exact: false },
    },
    {
        title: "Settings",
        to: "/dashboard/settings",
        icon: Settings2,
        activeOptions: { exact: false },
    },
])

const NavUserSkelton = () => {
    return (
        <div className="flex items-center gap-2 bg-muted p-2 py-3">
            <Skeleton className="size-8 rounded-full bg-muted-foreground/60" />
            <div className="flex flex-col gap-1">
                <Skeleton className="w-20 h-3 bg-muted-foreground/60" />
                <Skeleton className="w-32 h-2 bg-muted-foreground/30" />
            </div>
        </div>
    )
}

export function AppSidebar({ sessionData }: { sessionData: ReturnType<typeof getSession> }) {

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Link to="/dashboard" className="flex items-center gap-3">
                                <div className="relative bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full">
                                    <img
                                        src='https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683914713/tags/tanstack.png'
                                        alt='TanStack Logo'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">TanStack Starter</span>
                                    <span className="truncate text-xs">Tanstack ecosystem starter kit</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavPrimary navs={navItems} />
            </SidebarContent>
            <SidebarFooter>
                <Suspense fallback={<NavUserSkelton />}>
                    <NavUser sessionData={sessionData} />
                </Suspense>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
