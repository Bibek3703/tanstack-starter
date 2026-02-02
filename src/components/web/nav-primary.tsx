import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Link } from '@tanstack/react-router'

export interface NavPrimaryItemType {
    title: string
    to: string
    icon: React.ElementType
    activeOptions?: { exact: boolean }
}

function NavPrimary({ navs }: { navs: NavPrimaryItemType[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {navs.map((nav, index) => (
                        <SidebarMenuItem
                            key={index}
                        >
                            <SidebarMenuButton
                                render={<Link
                                    to={nav.to}
                                    activeProps={{
                                        'data-active': true
                                    }}
                                    activeOptions={nav.activeOptions}
                                    className="flex items-center gap-2 p-2"
                                >
                                    <nav.icon className="size-4" />
                                    <span>{nav.title}</span>
                                </Link>}
                            />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export default NavPrimary
