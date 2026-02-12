export interface User {
    id: string;
    name: string;
    email: string;
    role: "STAFF" | "ADMIN"
    createdAt: string;
}

export interface Session {
    id: string;
    name: string;
    email: string;
    role: "STAFF" | "ADMIN"
    token: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    banner: string;
    disabled: boolean;
    category_id: string;
    createdAt: string;
    uptatedAt: string;
    category?: {
        id: string;
        name: string;
    }
}

export interface Items{
    id: string;
    amount: number;
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        banner: string;
    }
}

export interface Order {
    id: string;
    table: number;
    name?: string;
    status: boolean;
    draft: boolean
    createdAt: string;
    items?: Items[];
}