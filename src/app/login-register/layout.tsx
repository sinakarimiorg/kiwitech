import { redirect } from "next/navigation"
import { getCurrentUser } from "@root/src/lib/auth/session"
import { DEFAULT_USER_NAME } from "@root/src/utils/profileValidation"

export const dynamic = "force-dynamic"

export default async function LoginRegisterLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()

    if (user && user.status !== "مسدود" && user.name !== DEFAULT_USER_NAME) {
        redirect("/p-user")
    }

    return <>{children}</>
}