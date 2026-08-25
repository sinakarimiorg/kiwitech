import { Schema, model, models } from "mongoose"
import { AdminCategory, AdminCategoryItem } from "../types/adminCategoryType"

type ICategoryItem = Omit<AdminCategoryItem, "_id">

type ICategory = Omit<AdminCategory, "_id">

const CategoryItemSchema = new Schema<ICategoryItem>({
    title: { type: String, required: true },
})

const CategorySchema = new Schema<ICategory>(
    {
        title: { type: String, required: true },
        icon: { type: String, required: true, default: "package" },
        active: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
        items: { type: [CategoryItemSchema], default: [] },
    },
    { timestamps: true }
)

export default models.Category || model<ICategory>("Category", CategorySchema)