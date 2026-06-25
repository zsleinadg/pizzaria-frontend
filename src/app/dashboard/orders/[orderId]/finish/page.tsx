import { getAuthToken } from "@/lib/auth"
import { FinishOrderForm } from "@/components/dashboard/finish-order-form"
import { apiClient } from "@/lib/api"

export default async function FinishOrderPage({
    params
}: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params
    const token = await getAuthToken()

    let table = 0
    if (token) {
        try {
            const order = await apiClient<{ table: number }>(`/order/detail?order_id=${orderId}`, { token })
            table = order.table
        } catch {}
    }

    return <FinishOrderForm orderId={orderId} table={table} />
}
