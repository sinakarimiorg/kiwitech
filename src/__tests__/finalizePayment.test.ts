import { beforeEach, describe, expect, it, vi } from "vitest"

// مدل‌ها و وابستگی‌های Next/DB mock می‌شوند؛ فقط منطق finalizePayment تست می‌شود.
const payment = { findOneAndUpdate: vi.fn(), findOne: vi.fn(), updateOne: vi.fn(), find: vi.fn() }
const order = { create: vi.fn() }
const verifyPayment = vi.fn()
const releaseStock = vi.fn()

vi.mock("next/headers", () => ({ headers: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: unknown) => fn }))
vi.mock("@root/src/lib/mongodb", () => ({ connectDB: vi.fn() }))
vi.mock("@models/Payment", () => ({ default: payment }))
vi.mock("@models/Order", () => ({ default: order }))
vi.mock("@models/Message", () => ({ default: { create: vi.fn() } }))
vi.mock("@models/User", () => ({ default: { updateOne: vi.fn() } }))
vi.mock("@models/WalletTransaction", () => ({ default: { create: vi.fn() } }))
vi.mock("@models/Discount", () => ({ default: { updateOne: vi.fn() } }))
vi.mock("@root/src/lib/orders/stock", () => ({ releaseStock }))
vi.mock("@root/src/lib/payment/zarinpal", () => ({ requestPayment: vi.fn(), verifyPayment }))

const { finalizePayment } = await import("@root/src/lib/payment/service")

const snapshot = { items: [{ product: "p1", count: 2, price: 1000 }], address: "x", phone: "09123456789", shippingCost: 0 }
const pending = (extra = {}) => ({
    _id: "pay1", user: "u1", purpose: "order", amount: 2000, status: "verifying",
    expiresAt: new Date(Date.now() + 600_000), orderSnapshot: snapshot, ...extra,
})

beforeEach(() => {
    vi.clearAllMocks()
})

describe("finalizePayment", () => {
    it("authority ناشناخته → failed", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(null)
        payment.findOne.mockResolvedValueOnce(null)
        expect(await finalizePayment("AUTH", false)).toEqual({ state: "failed", purpose: null })
    })

    it("پرداخت قبلاً paid شده (رفرش/دوبل‌کلیک) → بدون verify و بدون سفارش تکراری", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(null)
        payment.findOne.mockResolvedValueOnce({ status: "paid", purpose: "order", order: { toString: () => "ord1" } })

        expect(await finalizePayment("AUTH", false)).toEqual({ state: "paid", purpose: "order", orderId: "ord1" })
        expect(verifyPayment).not.toHaveBeenCalled()
        expect(order.create).not.toHaveBeenCalled()
    })

    it("هم‌زمان با یک verify در جریان → pending (سفارش دوم ساخته نمی‌شود)", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(null) // pending → verifying نشد
        payment.findOne.mockResolvedValueOnce({ status: "verifying", purpose: "order" })
        payment.findOneAndUpdate.mockResolvedValueOnce(null) // reclaim هم نشد (هنوز تازه است)

        expect(await finalizePayment("AUTH", false)).toEqual({ state: "pending" })
        expect(order.create).not.toHaveBeenCalled()
    })

    it("انصراف کاربر → failed و موجودی آزاد می‌شود", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(pending())

        expect(await finalizePayment("AUTH", true)).toEqual({ state: "failed", purpose: "order" })
        expect(releaseStock).toHaveBeenCalledWith(snapshot.items)
        expect(verifyPayment).not.toHaveBeenCalled()
    })

    it("verify رد شد → failed و موجودی آزاد می‌شود", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(pending())
        verifyPayment.mockResolvedValueOnce({ ok: false, error: "x" })

        expect(await finalizePayment("AUTH", false)).toEqual({ state: "failed", purpose: "order" })
        expect(releaseStock).toHaveBeenCalledTimes(1)
        expect(order.create).not.toHaveBeenCalled()
    })

    it("خطای شبکه در verify → pending؛ موجودی آزاد نمی‌شود و دوباره قابل تلاش است", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(pending())
        verifyPayment.mockResolvedValueOnce({ ok: false, error: "net", unknown: true })

        expect(await finalizePayment("AUTH", false)).toEqual({ state: "pending" })
        expect(releaseStock).not.toHaveBeenCalled()
        expect(payment.updateOne).toHaveBeenCalledWith({ _id: "pay1" }, { status: "pending" })
    })

    it("verify موفق → دقیقاً یک سفارش ساخته و paid می‌شود", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(pending())
        verifyPayment.mockResolvedValueOnce({ ok: true, refId: "123" })
        order.create.mockResolvedValueOnce({ _id: { toString: () => "ord1" } })

        expect(await finalizePayment("AUTH", false)).toEqual({ state: "paid", purpose: "order", orderId: "ord1" })
        expect(order.create).toHaveBeenCalledTimes(1)
        expect(payment.updateOne).toHaveBeenCalledWith({ _id: "pay1" }, expect.objectContaining({ status: "paid", refId: "123" }))
    })

    it("تلاش مجدد بعد از قطع‌شدن وسط کار: سفارش از قبل ساخته شده → سفارش تکراری ساخته نمی‌شود", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(null)
        payment.findOne.mockResolvedValueOnce({ status: "verifying", purpose: "order" })
        payment.findOneAndUpdate.mockResolvedValueOnce(pending({ order: { toString: () => "ord1" } })) // reclaim
        verifyPayment.mockResolvedValueOnce({ ok: true, refId: "123" })

        expect(await finalizePayment("AUTH", false)).toEqual({ state: "paid", purpose: "order", orderId: "ord1" })
        expect(order.create).not.toHaveBeenCalled()
    })

    it("پرداخت موفق بعد از انقضا → review (سفارش خودکار ساخته نمی‌شود)", async () => {
        payment.findOneAndUpdate.mockResolvedValueOnce(pending({ expiresAt: new Date(Date.now() - 1000) }))
        verifyPayment.mockResolvedValueOnce({ ok: true, refId: "999" })

        expect(await finalizePayment("AUTH", false)).toEqual({ state: "failed", purpose: "order" })
        expect(order.create).not.toHaveBeenCalled()
        expect(payment.updateOne).toHaveBeenCalledWith({ _id: "pay1" }, expect.objectContaining({ status: "review" }))
    })
})
