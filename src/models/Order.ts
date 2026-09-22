import { Schema, model, models, Types } from "mongoose";
import { OrderStatus } from "../types/adminOrderType";

export interface IOrderItem {
    product?: Types.ObjectId
    title: string
    img: string
    price: number
    count: number
}

export interface IOrder {
    user: Types.ObjectId
    items: IOrderItem[]
    address: string
    phone: string
    shippingCost: number
    status: OrderStatus
    isRead: Boolean
}

const OrderItemSchema = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: false },
        title: { type: String, required: true },
        img: { type: String, required: true },
        price: { type: Number, required: true },
        count: { type: Number, required: true, default: 1 },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [OrderItemSchema], default: [] },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        shippingCost: { type: Number, default: 0 },
        isRead: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"],
            default: "در حال پردازش",
        },
    },
    {
        timestamps: true
    }
);

export default models.Order || model<IOrder>("Order", OrderSchema);