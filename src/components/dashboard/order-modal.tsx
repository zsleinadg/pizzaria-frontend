import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { formartPrice } from "@/lib/format";
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
        async function loadOrder() {
            await fetchOrder()
        }
        loadOrder()
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
            alert("Erro to finish order")
        }

        if (result.success) {
            router.refresh()
            onClose()
        }
    }

    return (
        <Dialog open={order_id !== null} onOpenChange={() => onClose()}>
            <DialogContent className=" p-6 bg-app-card text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Order details
                    </DialogTitle>
                    <VisuallyHidden.Root>
                        <DialogDescription className="text-slate-400/40">
                            Viewing details for Order ID: {order_id}
                        </DialogDescription>
                    </VisuallyHidden.Root>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-gray-400">Loading...</p>
                    </div>
                ) : order ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Category's Name</p>
                                <p className="text-lg font-semibold">Table {order.table}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Customer</p>
                                <p className="text-lg font-semibold">
                                    {order.name || "Unidentified"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Status</p>
                                <span className="inline-block px-3 py-1 bg-gray-400 text-black rounded-full text-sm font-medium">
                                    In production
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                            <div className="space-y-3">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => {
                                        const subtotal = item.product.price * item.amount
                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-app-background rounded-lg p-4 border border-app-border"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-base mb-1">
                                                            {item.product.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-400 line-clamp-2">
                                                            {item.product.description}
                                                        </p>
                                                        <p className="text-sm text-gray-400 mt-2">
                                                            {formartPrice(item.product.price)} x {item.amount}
                                                        </p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="text-sm text-gray-400 mb-1">
                                                            Amount: {item.amount}
                                                        </p>
                                                        <p className="font-semibold text-lg">
                                                            Subtotal: {formartPrice(subtotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className=" text-gray-400 text-center py-4">
                                        No items in order
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-app-border pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-brand-primary">
                                    {formartPrice(calculateTotal())}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}

                <DialogFooter className="flex gap-3 sm:gap-3">
                    <Button
                        variant={"outline"}
                        onClick={() => onClose()}
                        className="flex-1 border-app-border text-white hover:text-white bg-transparent hover:bg-app-background transition-colors"
                    >
                        Close
                    </Button>
                    <Button
                        className="flex-1 bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold"
                        disabled={loading}
                        onClick={handleFinishOrder}
                    >
                        Finalize order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}