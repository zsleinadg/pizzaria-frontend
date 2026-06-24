import { DeleteButtonProduct } from "@/components/dashboard/delete-button";
import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { Package } from "lucide-react";
import Image from "next/image";


export default async function Products() {
    const token = await getAuthToken()

    let categories: Category[] = []
    let products: Product[] = []

    try {
        const result = await Promise.all([
            apiClient<Category[]>("/category", { token: token! }),
            apiClient<Product[]>("/products", { token: token! })
        ])
        categories = result[0]
        products = result[1]
    } catch (error) {
        console.error("Failed to load products or categories:", error)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price / 100)
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Products
                    </h1>
                    <p className="text-sm sm:text-base mt-1">Manage your products</p>
                </div>

                <ProductForm categories={categories} />
            </div>

            {products.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white overflow-hidden"
                        >
                            <div className="relative w-full h-48">
                                <Image
                                    src={product.banner}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="gap-2 flex items-center justify-between text-base md:text-lg">
                                    <div className="flex flex-row gap-2 items-center">
                                        <Package className="w-5 h-5" />
                                        <span>{product.name}</span>
                                    </div>
                                        <DeleteButtonProduct product_id = {product.id}/>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-gray-300 text-sm line-clamp-2">
                                    {product.description}
                                </p>
                                <div className=" flex items-center justify-between pt-2 border-t border-app-border">
                                    <span className="text-brand-primary font-bold text-lg">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.category && (
                                        <span className="text-xs bg-app-background px-2 py-1 rounded">
                                            {product.category.name}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-app-border rounded-lg bg-app-card/50">
                    <Package className="h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-white">No products found</h3>
                    <p className="text-gray-400 text-sm max-w-sm mt-1 mb-4">
                        You haven't added any products yet. Start by clicking the button above.
                    </p>
                </div>
            )}
        </div>
    )
}