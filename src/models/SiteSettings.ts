import { Schema, model, models } from "mongoose";

const HomeSectionSchema = new Schema(
    {
        key: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        limit: { type: Number, default: 10 },
    },
    { _id: false }
)

const SiteSettingsSchema = new Schema(
    {
        key: { type: String, required: true, unique: true, default: "main" },
        homeSections: { type: [HomeSectionSchema], default: [] },
    },
    { timestamps: true }
)

export default models.SiteSettings || model("SiteSettings", SiteSettingsSchema)