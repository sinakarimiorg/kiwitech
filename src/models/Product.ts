import mongoose, { Schema, models, model } from "mongoose"

export interface IProduct {
    name: string
    linkName: string
    price: number
    exPrice?: number
    discount?: number
    stock: number
    category: string
    subCategory: string
    description?: string
    colors: string
    tags: string[]
    img: string
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        linkName: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        exPrice: { type: Number },
        discount: { type: Number },
        stock: { type: Number, default: 0 },
        category: { type: String, required: true },
        subCategory: { type: String, required: true },
        description: { type: String, required: false },
        colors: { type: String, required: false },
        tags: { type: [String], required: false },
        img: { type: String, required: true },
    },
    { timestamps: true }
)

export default models.Product || model<IProduct>("Product", ProductSchema)