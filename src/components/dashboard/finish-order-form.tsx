"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendOrderAction } from "@/actions/orders"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

interface FinishOrderFormProps {
    orderId: string
    table: number
}

export function FinishOrderForm({ orderId, table }: FinishOrderFormProps) {
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData()
        formData.set("order_id", orderId)
        formData.set("name", name)

        const result = await sendOrderAction(formData)

        if (!result?.success) {
            setError(result?.error || "Failed to send order")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md space-y-6 p-8 bg-app-card border border-app-border rounded-lg">
                <div className="text-center space-y-2">
                    <CheckCircle className="w-12 h-12 text-brand-primary mx-auto" />
                    <h1 className="text-2xl font-bold text-white">Finish Order</h1>
                    <p className="text-gray-300 text-sm">Table: {table}</p>
                </div>

                <p className="text-gray-300 text-center">
                    Do you wish to finalize the order?
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Customer&apos;s name (optional)</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Customer name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white"
                    >
                        {isLoading ? "Sending..." : "Finalize Order"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
