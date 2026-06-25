"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api"
import { Category, Product, Items } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { QuantityControl } from "./quantity-control"
import { OrderItem } from "./order-item"
import { addItemAction, removeItemAction } from "@/actions/orders"

interface AddItemsProps {
    token: string
    orderId: string
}

export function AddItems({ token, orderId }: AddItemsProps) {
    const router = useRouter()

    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [loadingCategories, setLoadingCategories] = useState(true)

    const [products, setProducts] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState("")
    const [loadingProducts, setLoadingProducts] = useState(false)

    const [quantity, setQuantity] = useState(1)
    const [items, setItems] = useState<Items[]>([])
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [loadingRemove, setLoadingRemove] = useState<string | null>(null)
    const [error, setError] = useState("")

    const selectedProductData = products.find(p => p.id === selectedProduct)

    useEffect(() => {
        loadCategories()
        loadOrderItems()
    }, [])

    const loadCategories = async () => {
        try {
            const data = await apiClient<Category[]>("/category", { token })
            setCategories(data)
            setLoadingCategories(false)
        } catch {
            setLoadingCategories(false)
        }
    }

    const loadOrderItems = async () => {
        try {
            const data = await apiClient<{ items?: Items[] }>(`/order/detail?order_id=${orderId}`, { token })
            if (data.items) {
                setItems(data.items)
            }
        } catch {
            // order may not have items yet
        }
    }

    useEffect(() => {
        if (selectedCategory) {
            loadProducts(selectedCategory)
            setSelectedProduct("")
        } else {
            setProducts([])
        }
    }, [selectedCategory])

    const loadProducts = async (categoryId: string) => {
        setLoadingProducts(true)
        try {
            const data = await apiClient<Product[]>(`/category/product?category_id=${categoryId}`, { token })
            setProducts(data)
            setLoadingProducts(false)
        } catch {
            setProducts([])
            setLoadingProducts(false)
        }
    }

    const handleAddItem = async () => {
        if (!selectedProduct || !quantity) return
        setLoadingAdd(true)
        setError("")

        const formData = new FormData()
        formData.set("order_id", orderId)
        formData.set("product_id", selectedProduct)
        formData.set("amount", String(quantity))

        const result = await addItemAction(formData)

        if (result.success) {
            await loadOrderItems()
            setSelectedCategory("")
            setSelectedProduct("")
            setQuantity(1)
        } else {
            setError(result.error || "Failed to add item")
        }

        setLoadingAdd(false)
    }

    const handleRemoveItem = async (itemId: string) => {
        setLoadingRemove(itemId)
        setError("")
        const result = await removeItemAction(itemId, orderId)
        if (result.success) {
            await loadOrderItems()
        } else {
            setError(result.error || "Failed to remove item")
        }
        setLoadingRemove(null)
    }

    const total = items.reduce((sum, item) => sum + item.product.price * item.amount, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Add Items</h1>
                    <p className="text-sm sm:text-base mt-1">Order #{orderId.slice(0, 8)}</p>
                </div>
            </div>

            {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 p-6 bg-app-card border border-app-border rounded-lg">
                    <h2 className="text-lg font-semibold text-white">Select product</h2>

                    <div className="space-y-2">
                        <Label className="text-white">Category</Label>
                        {loadingCategories ? (
                            <p className="text-gray-400 text-sm">Loading categories...</p>
                        ) : (
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="border-app-border bg-app-background text-white">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="bg-app-card border-app-border">
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id}
                                            className="text-white hover:bg-transparent cursor-pointer"
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {selectedCategory && (
                        <div className="space-y-2">
                            <Label className="text-white">Product</Label>
                            {loadingProducts ? (
                                <p className="text-gray-400 text-sm">Loading products...</p>
                            ) : products.length === 0 ? (
                                <p className="text-gray-400 text-sm">No products registered in this category</p>
                            ) : (
                                <Select
                                    value={selectedProduct}
                                    onValueChange={setSelectedProduct}
                                >
                                    <SelectTrigger className="border-app-border bg-app-background text-white">
                                        <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-app-card border-app-border">
                                        {products.map((prod) => (
                                            <SelectItem
                                                key={prod.id}
                                                value={prod.id}
                                                className="text-white hover:bg-transparent cursor-pointer"
                                            >
                                                {prod.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    {selectedProductData && (
                        <div className="space-y-4 pt-2">
                            <div className="p-3 rounded-md bg-app-background border border-app-border space-y-1">
                                <p className="text-white font-medium">{selectedProductData.name}</p>
                                <p className="text-brand-primary font-bold">{formatPrice(selectedProductData.price)}</p>
                                {selectedProductData.description && (
                                    <p className="text-gray-400 text-xs">{selectedProductData.description}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <QuantityControl
                                    quantity={quantity}
                                    onIncrement={() => setQuantity(q => q + 1)}
                                    onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
                                />
                            </div>

                            <Button
                                onClick={handleAddItem}
                                disabled={loadingAdd}
                                className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white"
                            >
                                {loadingAdd ? "Adding..." : "To add"}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4 p-6 bg-app-card border border-app-border rounded-lg">
                    <h2 className="text-lg font-semibold text-white">Items added</h2>

                    {items.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No items added yet</p>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item) => (
                                <OrderItem
                                    key={item.id}
                                    item={item}
                                    onRemove={handleRemoveItem}
                                    isLoading={loadingRemove === item.id}
                                />
                            ))}
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-app-border">
                            <div className="flex justify-between text-white">
                                <span>Total</span>
                                <span className="font-bold text-brand-primary">{formatPrice(total)}</span>
                            </div>
                            <Button
                                onClick={() => router.push(`/dashboard/orders/${orderId}/finish`)}
                                className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white"
                            >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Advance
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
