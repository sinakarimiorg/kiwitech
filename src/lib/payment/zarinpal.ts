// اتصال به زرین‌پال (API v4). مبلغ‌ها به تومان هستند (currency: IRT).
// env لازم:
//   ZARINPAL_MERCHANT_ID  — شناسه‌ی ۳۶ کاراکتری پذیرنده
//   ZARINPAL_SANDBOX=true — برای تست روی sandbox.zarinpal.com

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID
const SANDBOX = process.env.ZARINPAL_SANDBOX === "true"
const BASE = SANDBOX ? "https://sandbox.zarinpal.com" : "https://payment.zarinpal.com"

type GatewayResponse<T> = { data?: T | []; errors?: { code?: number; message?: string } | [] }

async function post<T>(endpoint: string, body: Record<string, unknown>): Promise<GatewayResponse<T>> {
    if (!MERCHANT_ID) throw new Error("ZARINPAL_MERCHANT_ID تعریف نشده است")

    const res = await fetch(`${BASE}/pg/v4/payment/${endpoint}.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ merchant_id: MERCHANT_ID, ...body }),
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
    })
    return (await res.json()) as GatewayResponse<T>
}

export type RequestResult = { ok: true; authority: string; url: string } | { ok: false; error: string }

export async function requestPayment(params: {
    amount: number
    description: string
    callbackUrl: string
    mobile?: string
}): Promise<RequestResult> {
    try {
        const json = await post<{ code: number; authority: string }>("request", {
            amount: params.amount,
            currency: "IRT",
            description: params.description,
            callback_url: params.callbackUrl,
            ...(params.mobile ? { metadata: { mobile: params.mobile } } : {}),
        })

        const data = json.data as { code?: number; authority?: string } | undefined
        if (data && !Array.isArray(data) && data.code === 100 && data.authority) {
            return { ok: true, authority: data.authority, url: `${BASE}/pg/StartPay/${data.authority}` }
        }
        console.error("[zarinpal] request failed:", JSON.stringify(json.errors))
        return { ok: false, error: "اتصال به درگاه پرداخت برقرار نشد؛ لطفاً دوباره تلاش کنید" }
    } catch (error) {
        console.error("[zarinpal] request error:", error)
        return { ok: false, error: "درگاه پرداخت در دسترس نیست؛ لطفاً دوباره تلاش کنید" }
    }
}

export type VerifyResult =
    | { ok: true; refId: string; cardPan?: string }
    | { ok: false; error: string; /** خطای شبکه؛ یعنی نتیجه نامعلوم است، نه ناموفق */ unknown?: boolean }

export async function verifyPayment(params: { amount: number; authority: string }): Promise<VerifyResult> {
    try {
        const json = await post<{ code: number; ref_id: number; card_pan?: string }>("verify", params)
        const data = json.data as { code?: number; ref_id?: number; card_pan?: string } | undefined

        // ۱۰۰ = موفق ، ۱۰۱ = قبلاً تأیید شده
        if (data && !Array.isArray(data) && (data.code === 100 || data.code === 101)) {
            return { ok: true, refId: String(data.ref_id ?? ""), cardPan: data.card_pan }
        }
        console.error("[zarinpal] verify failed:", JSON.stringify(json.errors))
        return { ok: false, error: "پرداخت تأیید نشد" }
    } catch (error) {
        console.error("[zarinpal] verify error:", error)
        return { ok: false, error: "تأیید پرداخت با خطا مواجه شد", unknown: true }
    }
}
