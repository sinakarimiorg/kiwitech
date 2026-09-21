import { Schema, model, models } from "mongoose";
import { AdminOrder } from "../types/adminOrderType";


type IOrder = Omit<AdminOrder, "_id" | "createdAt">

const OrderItemSchema = new Schema(
    {
        title: { type: String, required: true },
        img: { type: String, required: true },
        price: { type: Number, required: true },
        count: { type: Number, required: true, default: 1 },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        customer: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        items: { type: [OrderItemSchema], default: [] },
        shippingCost: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"],
            default: "در حال پردازش",
        },
        isRead: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

export default models.Order || model<IOrder>("Order", OrderSchema);