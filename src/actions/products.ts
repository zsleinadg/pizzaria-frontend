"use server"

import { apiClient } from "@/lib/api"
import { getAuthToken } from "@/lib/auth"
import { Product } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function createProductAction(formData: FormData) {
    try {
        const token = await getAuthToken()

        if (!token) {
            return { success: false, error: "Erro to create product" }
        }

        const response = await apiClient<Product>("/product", {
            method: "POST",
            token: token,
            body: formData
        })

        revalidatePath("/dashboard/products")

        return { success: true, error: "" }

    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "An unexpected error occurred." }

    }
}

export async function deleteProductAction(product_id: string) {
    try {
        if (!product_id) return { success: false, error: "Failed to delete product" }

        const token = await getAuthToken()

        if (!token) return { success: false, error: "Unauthorized user" }

        await apiClient(`/product?product_id=${product_id}`, {
            method: "DELETE",
            token: token
        })

        revalidatePath("/dashboard/products")
        return { success: true, error: "" }
    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "An unexpected error occurred." }

    }
}