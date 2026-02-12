"use server";

import { apiClient } from "@/lib/api";
import { Session, User } from "@/lib/types";
import { clearAuthToken, setAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerAction(
    prevState: { success: boolean; error: string; redirectTo?: string } | null,
    formData: FormData
) {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const data = {
            name: name,
            email: email,
            password: password,
        }

        await apiClient<User>("/users", {
            body: JSON.stringify(data),
            method: "POST",
        })
        return { success: true, error: "", redirectTo: "/login" }
    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: "An unknown error occurred." }
    }
}

export async function loginAction(
    prevState: { success: boolean; error: string; redirectTo?: string } | null,
    formData: FormData
) {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const data = {
            email: email,
            password: password,
        }

        const response = await apiClient<Session>("/session", {
            body: JSON.stringify(data),
            method: "POST",
        })

        await setAuthToken(response.token)

        return { success: true, error: "", redirectTo: "/dashboard" }
    }
    catch (error) {
        console.log("Login error:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }

        return { success: false, error: "An unknown error occurred." }
    }
}

export async function logoutAction(){
    await clearAuthToken();
    redirect("/login");
}