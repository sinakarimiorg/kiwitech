import mongoose from "mongoose"

type MongooseCache = {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

declare global {
    var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }

export async function connectDB() {
    if (cached.conn) return cached.conn

    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
        throw new Error("لطفاً MONGODB_URI را در فایل .env.local تعریف کنید")
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }

    global.mongooseCache = cached
    return cached.conn
}