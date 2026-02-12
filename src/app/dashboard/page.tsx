import {ContentOrders} from "@/components/dashboard/content-orders";
import { getAuthToken } from "@/lib/auth";

export default async function Dashboard() {
    const token = await getAuthToken()
    return <ContentOrders token={token!} />
}