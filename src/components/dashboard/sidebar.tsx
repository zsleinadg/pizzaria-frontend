"use client"

import { ShoppingCart, Package, Tags, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { logoutAction } from "@/actions/auth"

export const menuItems = [
    { title: 'Dashboard', href: '/dashboard', icon: ShoppingCart },
    { title: 'Products', href: '/dashboard/products', icon: Package },
    { title: 'Categories', href: '/dashboard/categories', icon: Tags },
]

export function Sidebar({ userName }: { userName: string }) {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-app-border bg-app-sidebar">
            <div className="border-b border-app-border p-6">
                <h2 className="text-xl font-bold text-white">
                    Pizza<span className="text-brand-primary">Flow</span>
                </h2>
                <p className="text-sm text-gray-300 mt-1">Hello, {userName}!</p>
            </div>

            <nav className="flex-1 p-4 space-y-4">
                {menuItems.map((menu) => {

                    const Icon = menu.icon
                    const isActive = pathname === menu.href
                    return (
                        <Link
                            key={menu.title}
                            href={menu.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300",
                                isActive ? "bg-brand-primary text-white" : "hover:bg-gray-600"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {menu.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-app-border p-4">
                <form action={logoutAction}>
                    <Button
                    className="w-full justify-start gap-3 text-white hover:text-white hover:bg-transparent cursor-pointer"
                    type="submit"
                    variant="ghost">
                        <LogOut className="w-5 h-5"/>
                        Logout
                    </Button>
                </form>

            </div>
        </aside>
    )
}