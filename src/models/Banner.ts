import { Schema, model, models } from "mongoose";
import { AdminBanner } from "../types/adminBannerType";

type IBanner = Omit<AdminBanner, "_id">;

const BannerSchema = new Schema<IBanner>(
    {
        title: { type: String, required: true },
        position: { type: String, enum: ["landing", "amazingOffers", "categoriesByPhone"], required: true },
        image: { type: String, required: true },
        linkUrl: { type: String, default: "#" },
        order: { type: Number, default: 1 },
        status: { type: String, enum: ["active", "disabled"], default: "active" },
    },
    { timestamps: true }
)

export default models.Banner || model<IBanner>("Banner", BannerSchema);