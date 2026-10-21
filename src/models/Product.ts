import mongoose, { Schema, models, model } from "mongoose"
import { AdminProduct } from "../types/adminProductType"

type IProduct = Omit<AdminProduct, "_id">

const SpecSchema = new Schema(
    {
        label: { type: String, required: true, trim: true, maxlength: 40 },
        value: { type: String, required: true, trim: true, maxlength: 200 },
    },
    { _id: false }
)

const ColorSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 30 },
        hex: { type: String, default: "#9ca3af" },
        stock: { type: Number, min: 0 },
        price: { type: Number, min: 0 },
        exPrice: { type: Number, min: 0 },
    },
    { _id: false }
)

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        linkName: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        exPrice: { type: Number },
        discount: { type: Number },
        stock: { type: Number, default: 0, min: 0 },
        category: { type: String, required: true },
        subCategory: { type: String, required: true },
        description: { type: String, required: false },
        colors: { type: String, required: false },
        colorOptions: { type: [ColorSchema], default: [] },
        specs: { type: [SpecSchema], default: [] },
        tags: { type: [String], required: false },
        img: { type: String, required: true },
        isFeatured: { type: Boolean, default: false },
        images: { type: [String], default: [] },
    },
    { timestamps: true }
)

export default models.Product || model<IProduct>("Product", ProductSchema)