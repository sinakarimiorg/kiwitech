import { Schema, model, models } from "mongoose"

export interface ISetting {
    key: string
    freeShippingThreshold: number
    standardShippingCost: number
}

const SettingSchema = new Schema<ISetting>(
    {
        key: { type: String, required: true, unique: true },
        freeShippingThreshold: { type: Number, required: true, default: 2000000 },
        standardShippingCost: { type: Number, required: true, default: 45000 },
    },
    { timestamps: true }
)

export default models.Setting || model<ISetting>("Setting", SettingSchema)