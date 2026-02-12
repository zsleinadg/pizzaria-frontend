"use server"

import { apiClient } from "@/lib/api"
import { getAuthToken } from "@/lib/auth"
import { Category } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function createCategoryAction(formData: FormData) {
    try {
        const token = await getAuthToken()
        const name = formData.get("name") as string

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const data = {
            name: name
        }

        await apiClient<Category>("/category", {
            method: "POST",
            token: token,
            body: JSON.stringify(data)
        })

        revalidatePath("/dashboard/categories")

        return { success: true, error: "" }


    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "An unexpected error occurred." }

    }
}