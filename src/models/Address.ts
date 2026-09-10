import { Schema, model, models, Types } from 'mongoose';

export interface IAddress {
    user: Types.ObjectId
    title: string
    receiver: string
    phone: string
    fullAddress: string
    isDefault: boolean
}

const AddressSchema = new Schema<IAddress>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        receiver: { type: String, required: true },
        phone: { type: String, required: true },
        fullAddress: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default models.Address || model<IAddress>("Address", AddressSchema);