"use server"

import { apiClient } from "@/lib/api"
import { getAuthToken } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

export async function createOrderAction(formData: FormData) {
    let orderId: string | null = null

    try {
        const token = await getAuthToken()
        if (!token) return { success: false, error: "Unauthorized" }

        const table = Number(formData.get("table"))

        if (!table || table <= 0) {
            return { success: false, error: "Invalid table number" }
        }

        const order = await apiClient<{ id: string; table: number }>("/order", {
            method: "POST",
            token,
            body: JSON.stringify({ table })
        })

        orderId = order.id
        revalidatePath("/dashboard")
    } catch (error) {
        return { success: false, error: "Failed to create order" }
    }

    if (orderId) {
        redirect(`/dashboard/orders/${orderId}`)
    }

    return { success: false, error: "Failed to create order" }
}

export async function addItemAction(formData: FormData) {
    try {
        const token = await getAuthToken()
        if (!token) return { success: false, error: "Unauthorized" }

        const order_id = formData.get("order_id") as string
        const product_id = formData.get("product_id") as string
        const amount = Number(formData.get("amount"))

        if (!order_id || !product_id || !amount) {
            return { success: false, error: "Missing required fields" }
        }

        await apiClient("/order/add", {
            method: "POST",
            token,
            body: JSON.stringify({ order_id, product_id, amount })
        })

        revalidatePath(`/dashboard/orders/${order_id}`)
        return { success: true, error: "" }
    } catch (error) {
        return { success: false, error: "Failed to add item" }
    }
}

export async function removeItemAction(item_id: string, order_id: string) {
    if (!item_id) return { success: false, error: "Missing item id" }

    try {
        const token = await getAuthToken()
        if (!token) return { success: false, error: "Unauthorized" }

        await apiClient(`/order/remove?item_id=${item_id}`, {
            method: "DELETE",
            token
        })

        revalidatePath(`/dashboard/orders/${order_id}`)
        return { success: true, error: "" }
    } catch (error) {
        return { success: false, error: "Failed to remove item" }
    }
}

export async function sendOrderAction(formData: FormData) {
    let orderId: string | null = null

    try {
        const token = await getAuthToken()
        if (!token) return { success: false, error: "Unauthorized" }

        orderId = formData.get("order_id") as string
        const name = formData.get("name") as string

        if (!orderId) return { success: false, error: "Missing order id" }

        await apiClient("/order/send", {
            method: "PUT",
            token,
            body: JSON.stringify({ order_id: orderId, name: name || undefined })
        })

        revalidatePath("/dashboard")
    } catch (error) {
        return { success: false, error: "Failed to send order" }
    }

    if (orderId) {
        redirect("/dashboard")
    }

    return { success: false, error: "Failed to send order" }
}