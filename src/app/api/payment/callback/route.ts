import { NextRequest, NextResponse } from "next/server"
import { expireStalePayments, finalizePayment, isValidAuthority } from "@root/src/lib/payment/service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const authority = searchParams.get("Authority")
    const cancelled = searchParams.get("Status") !== "OK"
    const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.nextUrl.origin))

    if (!isValidAuthority(authority)) return redirectTo("/checkout/failed")

    try {
        const result = await finalizePayment(authority, cancelled)

        if (result.state === "paid") {
            return redirectTo(
                result.purpose === "wallet"
                    ? "/p-user/wallet?payment=success"
                    : `/checkout/success?order=${result.orderId}`
            )
        }
        if (result.state === "pending") return redirectTo("/checkout/failed?reason=pending")

        return redirectTo(result.purpose === "wallet" ? "/p-user/wallet?payment=failed" : "/checkout/failed")
    } catch (error) {
        console.error("[payment] callback error:", error)
        return redirectTo("/checkout/failed?reason=error")
    } finally {
        expireStalePayments(10).catch(() => { })
    }
}
