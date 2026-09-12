import { Schema, model, models, Types } from "mongoose";

export interface IFavorite {
    user: Types.ObjectId
    product: Types.ObjectId
}

const FavoriteSchema = new Schema<IFavorite>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
    { timestamps: true }
)

FavoriteSchema.index({ user: 1, product: 1 }, { unique: true })

export default models.Favorite || model<IFavorite>("Favorite", FavoriteSchema)