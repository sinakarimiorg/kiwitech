import mongoose, { Schema, models, model } from "mongoose"

export interface IProduct {
    name: string
    price: number
    exPrice?: number
    discount?: number
    stock: number
    category: string
    subCategory: string
    description?: string
    colors: string
    tags: string[]
    img1: string
    img2?: string
    linkName: string
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        exPrice: { type: Number },
        discount: { type: Number },
        stock: { type: Number, default: 0 },
        category: { type: String, required: true },
        subCategory: { type: String, required: true },
        description: { type: String, required: false },
        colors: { type: String, required: false },
        tags: { type: [String], required: false },
        img1: { type: String, required: true },
        img2: { type: String },
        linkName: { type: String, required: true, unique: true },
    },
    { timestamps: true }
)

export default models.Product || model<IProduct>("Product", ProductSchema)