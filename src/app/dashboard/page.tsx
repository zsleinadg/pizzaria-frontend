import { ContentOrders } from "@/components/dashboard/content-orders"
import { getAuthToken } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { Order } from "@/lib/types"

export default async function Dashboard() {
    const token = await getAuthToken()

    let initialOrders: Order[] = []
    if (token) {
        try {
            const response = await apiClient<Order[]>("/orders?draft=false", { token, cache: "no-store" })
            initialOrders = response.filter(order => !order.status)
        } catch {}
    }

    return <ContentOrders token={token!} initialOrders={initialOrders} />
}
