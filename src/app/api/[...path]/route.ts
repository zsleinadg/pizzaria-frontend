import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3333"

async function handleProxy(req: NextRequest, path: string[]) {
    const pathname = path.join("/")
    const search = req.nextUrl.search
    const backendUrl = `${BACKEND_URL}/${pathname}${search}`

    const headers = new Headers(req.headers)
    headers.delete("host")

    try {
        const body = req.method !== "GET" && req.method !== "HEAD"
            ? await req.text()
            : undefined

        const response = await fetch(backendUrl, {
            method: req.method,
            headers,
            body,
        })

        const data = response.headers.get("content-type")?.includes("application/json")
            ? await response.json()
            : await response.text()

        return NextResponse.json(data, { status: response.status })
    } catch {
        return NextResponse.json(
            { error: "Backend connection failed" },
            { status: 503 }
        )
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return handleProxy(req, path)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return handleProxy(req, path)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return handleProxy(req, path)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return handleProxy(req, path)
}
