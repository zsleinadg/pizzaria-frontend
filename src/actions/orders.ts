"use server"

import { apiClient } from "@/lib/api"
import { getAuthToken } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function finishOrderAction(order_id: string) {
    if (!order_id) return { success: false, error: "Failed to finish order" }

    try {
        const token = await getAuthToken()

        if (!token) return { success: false, error: "Unauthorized user" }

        const data = {
            order_id: order_id
        }

        await apiClient("/order/finish", {
            method: "PUT",
            token: token,
            body: JSON.stringify(data)
        })

        revalidatePath("/dashboard")

        return { success: true, error: "" }
    }
    catch (error) {
        return { success: false, error: "Failed to finish order" }
    }
}