import Layout from "@root/src/components/layouts/AdminPanelLayout"
import OrdersManager from "@root/src/components/templates/P-admin/Orders/OrdersManager"
import { connectDB } from "@root/src/lib/mongodb";
import OrderModel from "@models/Order"
import { AdminOrder } from "@root/src/types/adminOrderType"

const page = async () => {
    await connectDB()
    const orders = await OrderModel.find({}).sort({ _id: -1 }).lean()
    const initialOrders: AdminOrder[] = JSON.parse(JSON.stringify(orders))

    return (
        <Layout>
            <main>
                <OrdersManager initialOrders={initialOrders} />
            </main>
        </Layout>
    )
}

export default page;