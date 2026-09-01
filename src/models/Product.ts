import mongoose, { Schema, models, model } from "mongoose"
import { AdminProduct } from "../types/adminProductType"

type IProduct = Omit<AdminProduct, "_id">

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
        images: { type: [String], default: [] },
    },
    { timestamps: true }
)

export default models.Product || model<IProduct>("Product", ProductSchema)