"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantityControlProps {
    quantity: number
    onIncrement: () => void
    onDecrement: () => void
}

export function QuantityControl({ quantity, onIncrement, onDecrement }: QuantityControlProps) {
    return (
        <div className="flex items-center gap-3">
            <Button
                type="button"
                variant="default"
                size="icon"
                onClick={onDecrement}
                disabled={quantity <= 1}
                className="rounded-md w-8 h-8 bg-brand-primary hover:bg-brand-primary/80"
            >
                <Minus className="w-4 h-4" />
            </Button>
            <span className="text-white text-lg font-bold min-w-[2ch] text-center">{quantity}</span>
            <Button
                type="button"
                variant="default"
                size="icon"
                onClick={onIncrement}
                className="rounded-md w-8 h-8 bg-brand-primary hover:bg-brand-primary/80"
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    )
}
