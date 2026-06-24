"use client"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { deleteProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"

interface DeleteButtonProps{
    product_id: string
}

export function DeleteButtonProduct({product_id}: DeleteButtonProps){
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")

    async function handleDeleteProduct(){
        const result = await deleteProductAction(product_id)

        if(result.success){
            setOpen(false)
            router.refresh()
            return;
        }

        setError(result.error || "Failed to delete product")
    }


    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-primary/80">
                    <Trash className="h-5 w-5" />
                </Button>
            </DialogTrigger>

            <DialogContent className="p-6 bg-app-card text-white">
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <DialogFooter className="flex flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="flex-1 border-app-border text-white bg-transparent hover:bg-app-background hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteProduct}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}