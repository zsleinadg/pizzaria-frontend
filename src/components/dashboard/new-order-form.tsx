"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrderAction } from "@/actions/orders"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UtensilsCrossed } from "lucide-react"

interface NewOrderFormProps {
    token: string
}

export function NewOrderForm({ token }: NewOrderFormProps) {
    const [table, setTable] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData()
        formData.set("table", table)

        const result = await createOrderAction(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
            return
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md space-y-6 p-8 bg-app-card border border-app-border rounded-lg">
                <div className="text-center space-y-2">
                    <UtensilsCrossed className="w-12 h-12 text-brand-primary mx-auto" />
                    <h1 className="text-2xl font-bold text-white">New Order</h1>
                    <p className="text-gray-300 text-sm">Enter the table number to start</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="table" className="text-white">Table number</Label>
                        <Input
                            id="table"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Ex: 1"
                            value={table}
                            onChange={(e) => setTable(e.target.value)}
                            className="border-app-border bg-app-background text-white"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading || !table}
                        className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white"
                    >
                        {isLoading ? "Opening..." : "Open order"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
