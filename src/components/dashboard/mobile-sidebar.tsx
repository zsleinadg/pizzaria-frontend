"use client"

import { menuItems } from "./sidebar"
import { ShoppingCart, Package, Tags, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { logoutAction } from "@/actions/auth"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { useState } from "react"


export function MobileSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <div className="lg:hidden">
            <header className="sticky top-0 z-50 border-b border-app-border bg-app-card">
                <div className="flex h-16 items-center justify-between px-4">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size={"icon"}>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className=" w-72 p-0 bg-app-sidebar border-app-border"
                        >
                            <SheetHeader className="border-b border-app-border p-6">
                                <SheetTitle className="text-xl text-white font-bold">Menu</SheetTitle>
                            </SheetHeader>

                            <nav className="flex flex-col flex-1 p-4 space-y-4">
                                {menuItems.map((menu) => {

                                    const Icon = menu.icon
                                    const isActive = pathname === menu.href
                                    return (
                                        <Link
                                            key={menu.title}
                                            href={menu.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300 text-white",
                                                isActive ? "bg-brand-primary text-white" : "hover:bg-gray-600"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {menu.title}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="absolute bottom-0 border-t w-full border-app-border p-4">
                                <form action={logoutAction}>
                                    <Button
                                        className="w-full justify-start gap-3 text-white hover:text-white hover:bg-transparent cursor-pointer"
                                        type="submit"
                                        variant="ghost">
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </Button>
                                </form>

                            </div>
                        </SheetContent>
                    </Sheet>

                    <h1 className="text-lg font-bold">
                        Teste<span className="text-brand-primary">Pizzaria</span>
                    </h1>
                    <div>

                    </div>
                </div>

            </header>
        </div>
    )
}