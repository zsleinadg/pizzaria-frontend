"use client"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { deleteProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"

interface DeleteButtonProps{
    product_id: string
}

export function DeleteButtonProduct({product_id}: DeleteButtonProps){
    const router = useRouter()

    async function handleDeleteProduct(){
        const result = await deleteProductAction(product_id)

        if(result.success){
            router.refresh()
            return;
        }

    }


    return(
        <Button onClick={handleDeleteProduct} className="bg-brand-primary hover:bg-brand-primary/80">
            <Trash className="h-5 w-5" />
        </Button>
    )
}