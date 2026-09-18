import { Schema, model, models } from "mongoose"

export interface IContactMessage {
    name: string
    email?: string
    phone: string
    subject: string
    message: string
    status: "خوانده نشده" | "خوانده شده"
}

const ContactMessageSchema = new Schema<IContactMessage>(
    {
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ["خوانده نشده", "خوانده شده"], default: "خوانده نشده" },
    },
    { timestamps: true }
)

export default models.ContactMessage || model<IContactMessage>("ContactMessage", ContactMessageSchema)
