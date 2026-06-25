import { getAuthToken } from "@/lib/auth"
import { AddItems } from "@/components/dashboard/add-items"

export default async function AddItemsPage({
    params
}: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params
    const token = await getAuthToken()
    return <AddItems token={token!} orderId={orderId} />
}
