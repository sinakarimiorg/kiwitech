import { Schema, model, models } from "mongoose";
import { UserType, UserAddress } from "../types/UserType";

type IAddress = Omit<UserAddress, "_id">
type IUser = Omit<UserType, "_id" | "createdAt">


const AddressSchema = new Schema<IAddress>(
    {
        title: { type: String, required: true },
        receiver: { type: String, required: true },
        phone: { type: String, required: true },
        fullAddress: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
)

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: false },
        nationalCode: { type: String, required: false },
        birthDate: { type: String, required: false },
        ordersCount: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        status: { type: String, enum: ["فعال", "مسدود"], default: "فعال" },
        role: { type: String, enum: ["کاربر", "ادمین"], default: "کاربر" },
        addresses: { type: [AddressSchema], default: [] },
        favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        walletBalance: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);