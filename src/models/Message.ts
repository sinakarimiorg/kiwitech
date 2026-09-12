import { Schema, model, models, Types } from "mongoose"
import { MessageType, MessageSender } from "../types/userMessageType"

export interface IMessage {
    user: Types.ObjectId
    title: string
    body: string
    type: MessageType
    sender: MessageSender
    isRead: boolean
}

const MessageSchema = new Schema<IMessage>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        body: { type: String, required: true },
        type: {
            type: String,
            enum: [
                "سفارش",
                "سیستمی",
                "تخفیف",
                "سوال درباره سفارش",
                "مشکل فنی",
                "پیشنهاد و انتقاد",
                "سایر",
            ],
            default: "سیستمی",
        },
        sender: { type: String, enum: ["user", "admin"], default: "admin" },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default models.Message || model<IMessage>("Message", MessageSchema)