import mongoose, { Schema, models, model } from "mongoose"

export interface IProduct {
    title: string
    price: number
    exPrice?: number
    discount?: number
    description?: string
    img1: string
    img2?: string
    category: string
    stock: number
    shortName: string
}

const ProductSchema = new Schema<IProduct>(
    {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        exPrice: { type: Number },
        discount: { type: Number },
        description: { type: String },
        img1: { type: String, required: true },
        img2: { type: String },
        category: { type: String, required: true },
        stock: { type: Number, default: 0 },
        shortName: { type: String, required: true, unique: true },
    },
    { timestamps: true }
)

export default models.Product || model<IProduct>("Product", ProductSchema)