import { CategoryForm } from "@/components/dashboard/category-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api"
import { getAuthToken } from "@/lib/auth"
import { Category } from "@/lib/types"
import { Tags } from "lucide-react"

export default async function Categories() {
    const token = await getAuthToken()
    const categories = await apiClient<Category[]>("/category", {
        token: token!
    })

    return (
        <div className=" space-y-4 sm:space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Categories</h1>
                    <p className=" text-sm sm:text-base mt-1">Organize your product categories</p>
                </div>

                <CategoryForm />
            </div>

            {categories.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className=" bg-app-card border-app-border transition-shadow hover:shadow-md text-white"
                        >

                            <CardHeader>
                                <CardTitle className="gap-2 flex items-center text-base md:text-lg">
                                    <Tags className="w-5 h-5" />
                                    <span>{category.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className=" text-gray-200/20 text-sm">ID: {category.id}</p>
                            </CardContent>

                        </Card>
                    ))}
                </div>
            )}


            {categories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-app-border rounded-lg bg-app-card/50">
                    <Tags className="h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-white">No categories found</h3>
                    <p className="text-gray-400 text-sm max-w-sm mt-1 mb-4">
                        You haven't created any categories yet. Click the button above to start organizing your menu.
                    </p>
                </div>
            )}

        </div>
    )
}