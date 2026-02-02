"use client"

import * as React from "react"
import {
    BookmarkIcon,
    BotIcon,
    CompassIcon,
    ImportIcon,
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



export type NavUserType = {
    name: string
    email: string
    avatar: string
}

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    } as NavUserType,
    navPrimary: linkOptions([
        {
            title: "Items",
            to: "/dashboard/items",
            icon: BookmarkIcon,
            activeOptions: { exact: false },
        },
        {
            title: "Import",
            to: "/dashboard/import",
            icon: ImportIcon,
            activeOptions: { exact: false },
        },
        {
            title: "Discover",
            to: "/dashboard/discover",
            icon: CompassIcon,
            activeOptions: { exact: false },
        },
    ]) as NavPrimaryItemType[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
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
                <NavPrimary navs={data.navPrimary} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
