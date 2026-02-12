import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/auth"
import { LogOut, ShieldX } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AccessDenied() {
    const user = await getUser()
    if (!user) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-app-background">
            <Card className="bg-app-card border-app-border text-white max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <ShieldX className="h-16 w-16 text-brand-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Access Denied
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <CardDescription className="text-gray-300 text-center">
                        You don't have permission to open the administration panel.
                    </CardDescription>
                    <p className="text-sm text-gray-400 text-center">
                        If you think this is a mistake, talk to the person in charge of the system.
                    </p>
                    <form action={logoutAction} className="flex justify-center pt-2">
                        <Button
                            type="submit"
                            variant={"default"}
                            className="w-full border-app-border bg-brand-primary text-white hover:bg-brand-primary/80"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}