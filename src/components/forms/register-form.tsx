"use client"

import { registerAction } from "@/actions/auth"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(registerAction, null)
    const router = useRouter()

    useEffect(() => {
        if (state?.success && state?.redirectTo) {
            router.replace(state.redirectTo)
        }
    }, [state, router])

    return (
        <Card className="bg-app-card border-app-border w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
                    Pizza<span className="text-brand-primary">Flow</span>
                </CardTitle>
                <CardDescription className="text-white text-center mt-2">Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" action={formAction}>
                    <div className="space-y-2">
                        <Label
                            className="text-white"
                            htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            required
                            className="text-white bg-app-card border-app-border" />
                    </div>
                    <div className="space-y-2">
                        <Label
                            className="text-white"
                            htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Your email"
                            required
                            className="text-white bg-app-card border-app-border" />
                    </div>
                    <div className="space-y-2">
                        <Label
                            className="text-white"
                            htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Your password"
                            required
                            className="text-white bg-app-card border-app-border" />
                    </div>

                    {state?.error && (
                        <div className=" bg-red-500/15 p-3 rounded-md border border-red-500/50">
                            <p className="text-red-500 text-sm text-center">
                                {state.error}
                            </p>
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white cursor-pointer mt-4">
                        {isPending ? 'Registering...' : 'Register'}
                    </Button>

                    <p className="text-white text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-brand-primary hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}