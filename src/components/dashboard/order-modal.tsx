import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { formatPrice } from "@/lib/format";
import { Button } from "../ui/button";
import { finishOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface OrderModalProps {
    order_id: string | null;
    onClose: () => Promise<void>;
    token: string
}

export function OrderModal({ order_id, onClose, token }: OrderModalProps) {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fetchOrder = async () => {
        if (!order_id) {
            setOrder(null)
            return
        }

        try {
            setLoading(true)
            const response = await apiClient<Order>(`/order/detail?order_id=${order_id}`, {
                method: "GET",
                token: token
            })
            setOrder(response)
            setLoading(false)
        }
        catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (order_id) {
            fetchOrder()
        }
    }, [order_id])

    const calculateTotal = () => {
        if (!order?.items) return 0
        return order.items.reduce((total, item) => {
            return total + item.product.price * item.amount
        }, 0)
    }

    const handleFinishOrder = async () => {
        if (!order_id) return
        const result = await finishOrderAction(order_id)

        if (!result.success) {
            alert("Error to finish order")
        }

        if (result.success) {
            router.refresh()
            onClose()
        }
    }

    return (
        <Dialog open={order_id !== null} onOpenChange={() => onClose()}>
            <DialogContent 
                className="p-0 bg-app-card text-white max-w-2xl w-[95vw] max-h-[90vh] flex flex-col overflow-hidden border-app-border"
            >
                <div className="p-6 pb-2">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Order details
                        </DialogTitle>
                        <VisuallyHidden.Root>
                            <DialogDescription>
                                Viewing details for Order ID: {order_id}
                            </DialogDescription>
                        </VisuallyHidden.Root>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-gray-400 animate-pulse">Loading order details...</p>
                        </div>
                    ) : order ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-app-background/50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Table</p>
                                    <p className="text-lg font-semibold">Number {order.table}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                                    <p className="text-lg font-semibold truncate">
                                        {order.name || "Unidentified"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                    <span className="inline-block px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-sm font-medium border border-brand-primary/30">
                                        In production
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    Items 
                                    <span className="text-sm font-normal text-gray-400">({order.items?.length || 0})</span>
                                </h3>
                                <div className="space-y-3">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item) => {
                                            const subtotal = item.product.price * item.amount
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="bg-app-background rounded-lg p-4 border border-app-border hover:border-brand-primary/50 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-base mb-1">
                                                                {item.product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-400 line-clamp-2 mb-2 italic">
                                                                {item.product.description}
                                                            </p>
                                                            <p className="text-sm font-medium text-brand-primary">
                                                                {formatPrice(item.product.price)} <span className="text-gray-500">x</span> {item.amount}
                                                            </p>
                                                        </div>
                                                        <div className="text-right flex flex-col justify-between h-full">
                                                            <p className="font-bold text-lg">
                                                                {formatPrice(subtotal)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No items in order</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="p-6 pt-2 bg-app-card border-t border-app-border">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-2xl font-black text-brand-primary">
                            {formatPrice(calculateTotal())}
                        </span>
                    </div>

                    <DialogFooter className="flex flex-row gap-3 sm:justify-end">
                        <Button
                            variant={"outline"}
                            onClick={() => onClose()}
                            className="flex-1 border-app-border text-white bg-transparent hover:bg-app-background hover:text-white transition-all"
                        >
                            Close
                        </Button>
                        <Button
                            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold shadow-lg shadow-brand-primary/20"
                            disabled={loading}
                            onClick={handleFinishOrder}
                        >
                            Finalize Order
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}