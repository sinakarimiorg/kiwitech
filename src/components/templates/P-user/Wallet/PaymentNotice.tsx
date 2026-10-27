"use client"

import { useEffect } from "react"
import Swal from "sweetalert2"

export default function PaymentNotice({ status }: { status?: string }) {
    useEffect(() => {
        if (status === "success") {
            Swal.fire({ icon: "success", title: "پرداخت موفق", text: "موجودی کیف پول شما افزایش یافت", timer: 2500, showConfirmButton: false })
        } else if (status === "failed") {
            Swal.fire({ icon: "error", title: "پرداخت ناموفق", text: "پرداخت انجام نشد یا لغو شد", confirmButtonText: "متوجه شدم" })
        }
        if (status) window.history.replaceState(null, "", "/p-user/wallet")
    }, [status])

    return null
}
