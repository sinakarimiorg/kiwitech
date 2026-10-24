import { cookies, headers } from "next/headers"
import { createHash, randomBytes } from "crypto"
import { connectDB } from "../mongodb"
import UserModel from "@models/User"
import SessionModel from "@models/Session"

export const SESSION_COOKIE = "kiwitech_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export const ADMIN_DENIED = { success: false as const, error: "شما دسترسی لازم برای این کار را ندارید" }
export const LOGIN_REQUIRED = { success: false as const, error: "ابتدا وارد حساب کاربری خود شوید" }

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex")

// ────────────────────────────────
// Create a new session: random token in cookie, hash in database
// ────────────────────────────────
export async function createSession(userId: string) {
    await connectDB()

    const token = randomBytes(32).toString("hex")
    const h = await headers()

    await SessionModel.create({
        user: userId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
        userAgent: h.get("user-agent")?.slice(0, 200),
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
    })
}

// Logout (should only be called inside Server Action or Route Handler)
export async function destroySession() {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (token) {
        await connectDB()
        await SessionModel.deleteOne({ tokenHash: hashToken(token) })
    }
    cookieStore.delete(SESSION_COOKIE)
}

// Logout from all devices (when user is blocked/deleted)
export async function destroyAllSessions(userId: string) {
    await connectDB()
    await SessionModel.deleteMany({ user: userId })
}

// ────────────────────────────────
// Current user; blocked user is always null
// ────────────────────────────────
export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    await connectDB()

    try {
        const session = await SessionModel.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } }).lean()
        if (!session) return null

        const user = await UserModel.findById((session as { user: unknown }).user).lean()
        if (!user || (user as { status?: string }).status === "مسدود") return null

        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        console.error("Error fetching user:", error)
        return null
    }
}

// ────────────────────────────────
// Guards: call at the start of each Server Action
// ────────────────────────────────
export async function requireUser() {
    return getCurrentUser()
}

export async function requireAdmin() {
    const user = await getCurrentUser()
    return user && user.role === "ادمین" ? user : null
}
