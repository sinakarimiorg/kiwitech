import { Schema, model, models, Types } from "mongoose"
import { MessageType } from "../types/UserMessageType"

export interface IMessage {
    user: Types.ObjectId
    title: string
    body: string
    type: MessageType
    isRead: boolean
}

const MessageSchema = new Schema<IMessage>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        body: { type: String, required: true },
        type: { type: String, enum: ["سفارش", "سیستمی", "تخفیف"], default: "سیستمی" },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default models.Message || model<IMessage>("Message", MessageSchema)
