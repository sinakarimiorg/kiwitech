import { Schema, model, models } from 'mongoose';

export interface IOtp {
    phone: string;
    code: string;
    expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>(
    {
        phone: { type: String, required: true },
        code: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.Otp || model<IOtp>("Otp", OtpSchema);