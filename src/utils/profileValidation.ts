export type ProfileFields = {
    name: string
    email?: string
    nationalCode?: string
    birthDate?: string
}

export type ProfileErrors = Partial<Record<keyof ProfileFields, string>>

export const DEFAULT_USER_NAME = 'کاربر جدید'

const MIN_AGE = 7
const MIN_BIRTH_YEAR = 1300

const NAME_REGEX = /^[\p{L}\u200c\s.'-]+$/u
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export function toEnglishDigits(value: string) {
    return value
        .replace(/[۰-۹]/g, d => String(PERSIAN_DIGITS.indexOf(d)))
        .replace(/[٠-٩]/g, d => String(ARABIC_DIGITS.indexOf(d)))
}

export function getCurrentJalaliYear() {
    try {
        const parts = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', { year: 'numeric' }).formatToParts(new Date())
        const year = Number(parts.find(p => p.type === 'year')?.value)
        return Number.isFinite(year) && year > 1300 ? year : 1405
    } catch {
        return 1405
    }
}

const isJalaliLeapYear = (year: number) => [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33)

export function isValidNationalCode(code: string) {
    if (!/^\d{10}$/.test(code)) return false
    if (/^(\d)\1{9}$/.test(code)) return false

    const digits = code.split('').map(Number)
    const sum = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0)
    const remainder = sum % 11

    return remainder < 2 ? digits[9] === remainder : digits[9] === 11 - remainder
}

export function isValidJalaliDate(value: string) {
    const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(value)
    if (!match) return false

    const [year, month, day] = match.slice(1).map(Number)
    if (year < MIN_BIRTH_YEAR || year > getCurrentJalaliYear() - MIN_AGE) return false
    if (month < 1 || month > 12) return false

    const maxDay = month <= 6 ? 31 : month <= 11 ? 30 : isJalaliLeapYear(year) ? 30 : 29
    return day >= 1 && day <= maxDay
}

export function formatJalaliDateInput(raw: string) {
    const digits = toEnglishDigits(raw).replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 4) return digits
    if (digits.length <= 6) return `${digits.slice(0, 4)}/${digits.slice(4)}`
    return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6)}`
}

export function validateProfile(input: ProfileFields) {
    const values: Required<ProfileFields> = {
        name: input.name.replace(/\s+/g, ' ').trim(),
        email: (input.email ?? '').trim().toLowerCase(),
        nationalCode: toEnglishDigits(input.nationalCode ?? '').trim(),
        birthDate: toEnglishDigits(input.birthDate ?? '').trim(),
    }

    const errors: ProfileErrors = {}

    if (!values.name) {
        errors.name = 'نام و نام خانوادگی را وارد کنید.'
    } else if (values.name === DEFAULT_USER_NAME) {
        errors.name = 'نام واقعی خود را وارد کنید.'
    } else if (values.name.length < 3 || values.name.length > 60) {
        errors.name = 'نام باید بین ۳ تا ۶۰ کاراکتر باشد.'
    } else if (!NAME_REGEX.test(values.name)) {
        errors.name = 'نام فقط می‌تواند شامل حروف باشد.'
    }

    if (values.email && !EMAIL_REGEX.test(values.email)) {
        errors.email = 'ایمیل واردشده معتبر نیست.'
    }

    if (values.nationalCode && !isValidNationalCode(values.nationalCode)) {
        errors.nationalCode = 'کد ملی واردشده معتبر نیست.'
    }

    if (values.birthDate && !isValidJalaliDate(values.birthDate)) {
        errors.birthDate = 'تاریخ تولد را به شکل صحیح وارد کنید. مثال: 1375/04/21'
    }

    return { values, errors }
}
