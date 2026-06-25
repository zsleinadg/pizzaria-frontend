"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { Order } from "@/lib/types"
import { EyeIcon, RefreshCcw } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { formatPrice } from "@/lib/format"
import { OrderModal } from "./order-modal"
import { useRouter } from "next/navigation"

interface OrderProps {
    token: string
    initialOrders: Order[]
}

export function ContentOrders({ token, initialOrders }: OrderProps) {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [loading, setLoading] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<null | string>(null)

    const fetchOrders = useCallback(async () => {
        try {
            const response = await apiClient<Order[]>("/orders?draft=false", {
                method: "GET",
                cache: "no-store",
                token: token
            })

            const pendingOrders = response.filter(order => !order.status)

            setOrders(pendingOrders)
            setLoading(false)
        }
        catch (error) {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        fetchOrders()
        const interval = setInterval(fetchOrders, 30000)
        return () => clearInterval(interval)
    }, [fetchOrders])

    const calculateOrderTotal = (order: Order) => {
        if (!order.items) return 0

        return order.items.reduce((total, item) => {
            return total + item.product.price * item.amount
        }, 0)
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Orders
                    </h1>
                    <p className="text-sm sm:text-base mt-1">Manage your orders</p>
                </div>

                <Button onClick={fetchOrders} className="bg-brand-primary hover:bg-brand-primary/80">
                    <RefreshCcw className="h-5 w-5" />
                </Button>
            </div>

            {loading ? (
                <div>
                    <p className="text-center text-gray-300">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div>
                    <p className="text-center text-gray-300">No orders found at the moment</p>
                </div>
            ) : (
                <div className=" grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {orders.map(order => (
                        <Card
                            className="bg-app-card border-app-border text-white"
                            key={order.id}>

                            <CardHeader className="border-b border-app-border/50">
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className=" text-lg lg:text-xl font-bold">
                                        Mesa {order.table}
                                    </CardTitle>
                                    <Badge className="text-xs bg-gray-400 text-black select-none">
                                        in production
                                    </Badge>
                                </div>
                                <CardDescription>
                                    {order.name ? (
                                        <span>Customer: {order.name}</span>
                                    ) : (
                                        <span>Customer: Unidentified</span>
                                    )}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3 sm:space-y-4 mt-auto">

                                <div>
                                    {order.items && order.items.length > 0 && (
                                        <div className="space-y-1">
                                            {order.items.slice(0, 2).map(item => (
                                                <p key={item.id} className="text-xs sm:text-sm text-gray-300 truncate">
                                                    - {item.amount}x {item.product.name}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col xl:flex-row items-center justify-between pt-4 border-t border-app-border gap-3">
                                    <div className=" self-start">
                                        <p className="text-sm text-gray-400 md:text-base">Total</p>
                                        <p className="text-base font-bold text-brand-primary">{formatPrice(calculateOrderTotal(order))}</p>
                                    </div>
                                    <Button
                                    onClick={() => setSelectedOrder(order.id)}
                                        size={"sm"}
                                        className="bg-brand-primary hover:bg-brand-primary/80 w-full xl:w-auto"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                        Details
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <OrderModal
            token={token}
            order_id={selectedOrder}
            onClose={async () => {
                setSelectedOrder(null)
                await fetchOrders()
            }}
            />
        </div>
    )
}
