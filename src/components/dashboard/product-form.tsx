"use client"

import { Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Image from "next/image";
import { createProductAction } from "@/actions/products";

interface ProductFormProps {
    categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [priceValue, setPriceValue] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    function convertBRLToCents(value: string): number {
        const cleanValue = value.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".")

        const reais = parseFloat(cleanValue) || 0;

        return Math.round(reais * 100)
    }

    async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        if (!imageFile) return

        const formData = new FormData()

        const formElement = e.currentTarget

        const name = (formElement.elements.namedItem("name") as HTMLInputElement)?.value
        const description = (formElement.elements.namedItem("description") as HTMLInputElement)?.value
        const priceInCents = convertBRLToCents(priceValue)

        formData.append("name", name)
        formData.append("description", description)
        formData.append("price", priceInCents.toString())
        formData.append("category_id", selectedCategory)
        formData.append("file", imageFile)

        const result = await createProductAction(formData)

        setIsLoading(false)

        if (result.success) {
            setOpen(false)
            setSelectedCategory("")
            setPriceValue("")
            setImagePreview(null)
            setImageFile(null)

            router.refresh()
            return
        }
    }

    function formatToBrl(value: string) {
        const numbers = value.replace(/\D/g, "")

        if (!numbers) return ""

        const amount = parseInt(numbers) / 100

        return amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatToBrl(e.target.value)
        setPriceValue(formatted)
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                return
            }
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    function clearImage() {
        setImageFile(null)
        setImagePreview(null)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-primary/80 font-semibold">
                    <Plus className=" h-5 w-5 mr-2" />
                    New Product
                </Button>
            </DialogTrigger>

            <DialogContent className="p-6 bg-app-card text-white max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>New Product</DialogTitle>
                    <DialogDescription>
                        Create a new product...
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="space-y-4"
                    onSubmit={handleCreateProduct}
                >
                    <div>
                        <Label htmlFor="name" className="mb-2" >
                            Product's Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Write the product's name..."
                            required
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>

                    <div>
                        <Label htmlFor="price" className="mb-2" >
                            Price
                        </Label>
                        <Input
                            id="price"
                            name="price"
                            type="text"
                            placeholder="Write the product's price... Ex: 29.90"
                            required
                            className="border-app-border bg-app-background text-white"
                            value={priceValue}
                            onChange={handlePriceChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description" className="mb-2" >
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Write the product's description..."
                            required
                            className="border-app-border bg-app-background text-white min-h-25 resize-none"
                        />
                    </div>

                    <div>
                        <Label htmlFor="category" className="mb-2" >
                            Category
                        </Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="border-app-border bg-app-background text-white">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="bg-app-card border-app-border">
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                        className="text-white hover:bg-transparent cursor-pointer"
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file" className="mb-2" >
                            Product's Image
                        </Label>
                        {imagePreview ? (
                            <div className="relative w-full h-64 border-2 border-app-border rounded-lg overflow-hidden group shadow-inner bg-app-background/20">
                                <Image
                                    src={imagePreview}
                                    alt="Product preview"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={clearImage}
                                    className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2.5 group-hover:translate-y-0 bg-brand-primary hover:bg-brand-primary/80"
                                    title="Remove image"
                                >
                                    <span className="text-xs font-bold">✕</span>
                                </Button>

                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest text-white px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Preview Mode
                                </div>
                            </div>
                        ) : (
                            <div className="group relative">
                                <Label
                                    htmlFor="file"
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-app-background/50 border-app-border transition-all hover:bg-app-card hover:border-brand-primary group-focus-within:ring-2 group-focus-within:ring-brand-primary"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-10 w-10 text-gray-400 mb-3 transition-colors group-hover:text-brand-primary" />
                                        <p className="mb-2 text-sm text-gray-300">
                                            <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                                    </div>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="image/jpeg, image/jpg, image/png"
                                        onChange={handleImageChange}
                                        required
                                        className="sr-only"
                                    />
                                </Label>

                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !selectedCategory}
                        className=" w-full bg-brand-primary text-white hover:bg-brand-primary disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : "Create product"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}