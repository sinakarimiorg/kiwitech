import { Schema, model, models } from "mongoose";
import { AdminComment } from "../types/adminCommentType";

type Icomment = Omit<AdminComment, "_id" | "createdAt">;

const CommentSchema = new Schema<Icomment>(
    {
        author: { type: String, required: true },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        text: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        status: { type: String, enum: ["تایید شده", "در انتظار بررسی", "رد شده"], default: "در انتظار بررسی" },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default models.Comment || model<Icomment>("Comment", CommentSchema);