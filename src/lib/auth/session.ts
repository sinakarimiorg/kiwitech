import { cookies } from "next/headers";
import { connectDB } from "../mongodb";
import UserModel from "@models/User"

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("kiwitech_session")?.value
    if (!userId) return null

    await connectDB()

    try {
        const user = await UserModel.findById(userId).lean()
        return user ? JSON.parse(JSON.stringify(user)) : null
    } catch (error) {
        console.error("Error fetching user:", error)
        return null
    }
}