/** تاریخ امروز به وقت تهران به شکل شمسی 1405/08/10 (قابل مقایسه‌ی الفبایی با تاریخ‌های ذخیره‌شده). */
export function todayJalali(): string {
    const parts = new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn", {
        timeZone: "Asia/Tehran",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date())
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? ""
    return `${get("year")}/${get("month")}/${get("day")}`
}
