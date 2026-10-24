import { toEnglishDigits } from "@root/src/utils/profileValidation"

const MOBILE_REGEX = /^09\d{9}$/

// ارقام فارسی/عربی، +98، 0098 و بدون صفر اول را به قالب 09xxxxxxxxx تبدیل می‌کند
export function normalizePhone(input: unknown): string {
    let digits = toEnglishDigits(String(input ?? "")).replace(/\D/g, "")
    if (digits.startsWith("0098")) digits = digits.slice(4)
    else if (digits.startsWith("98") && digits.length === 12) digits = digits.slice(2)
    return digits.startsWith("0") ? digits : `0${digits}`
}

export const isValidMobile = (input: unknown) => MOBILE_REGEX.test(normalizePhone(input))
