"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/format"
import { Items } from "@/lib/types"

interface OrderItemProps {
    item: Items
    onRemove: (itemId: string) => void
    isLoading?: boolean
}

export function OrderItem({ item, onRemove, isLoading }: OrderItemProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-app-background border border-app-border">
            <div className="space-y-1">
                <p className="text-white text-sm font-medium">{item.product.name}</p>
                <p className="text-gray-300 text-xs">
                    {item.amount}x - {formatPrice(item.product.price)}
                </p>
            </div>
            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(item.id)}
                disabled={isLoading}
                className="rounded-md w-8 h-8"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    )
}
