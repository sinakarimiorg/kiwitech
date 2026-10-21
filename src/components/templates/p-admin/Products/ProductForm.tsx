"use client"

import { useEffect, useRef, useState, useTransition, type KeyboardEvent, type ReactNode } from "react"
import { Formik, Form, Field, ErrorMessage, useFormikContext, type FieldProps } from "formik"
import * as Yup from "yup"
import Swal from "sweetalert2"
import type { IconType } from "react-icons"
import {
    PiPackageLight,
    PiTagLight,
    PiStackLight,
    PiImageLight,
    PiXCircleFill,
    PiXBold,
    PiFloppyDiskLight,
    PiPlusCircleLight,
    PiTrashLight,
    PiPaletteLight,
    PiPercentLight,
    PiListBulletsLight,
    PiTextAlignRightLight,
    PiStarFill,
} from "react-icons/pi"
import { addProductAction, updateProductAction } from "./actions"
import type { AdminProduct, ProductColor, ProductSpec } from "@root/src/types/adminProductType"
import { isLightColor } from "@root/src/lib/productVariants"

/* ───────── Categories and Subcategories ───────── */
export interface CategoryItem {
    _id: string
    title: string
}

export interface CategoryData {
    title: string
    items: CategoryItem[]
}

function CategoryAndSubCategoryFields({ categories }: { categories: CategoryData[] }) {
    const { values, setFieldValue } = useFormikContext<ProductFormValues>()

    const selectedCategory = categories.find(cat => cat.title === values.category)

    const availableSubCategories = selectedCategory ? selectedCategory.items.map(item => item.title) : []

    useEffect(() => {
        if (values.subCategory && !availableSubCategories.includes(values.subCategory)) {
            setFieldValue("subCategory", "")
        }
    }, [values.category, availableSubCategories, values.subCategory, setFieldValue])

    return (
        <>
            {/* Select Category */}
            <div>
                <label className={`${labelCls} flex items-center gap-1.5`}>
                    <PiTagLight className="w-3.5 h-3.5" />
                    دسته‌بندی *
                </label>
                <Field as="select" name="category" className={inputCls}>
                    <option value="">انتخاب کنید</option>
                    {categories.map(cat => (
                        <option key={cat.title} value={cat.title}>
                            {cat.title}
                        </option>
                    ))}
                </Field>
                <ErrorMessage name="category" component="span" className={errCls} />
            </div>

            {/* Select SubCategory */}
            <div>
                <label className={`${labelCls} flex items-center gap-1.5`}>
                    <PiTagLight className="w-3.5 h-3.5" />
                    زیرمجموعه *
                </label>
                <Field
                    as="select"
                    name="subCategory"
                    className={inputCls}
                    disabled={!values.category}
                >
                    <option value="">
                        {values.category ? "انتخاب کنید" : "ابتدا دسته‌بندی را انتخاب کنید"}
                    </option>
                    {availableSubCategories.map(sub => (
                        <option key={sub} value={sub}>
                            {sub}
                        </option>
                    ))}
                </Field>
                <ErrorMessage name="subCategory" component="span" className={errCls} />
            </div>
        </>
    )
}
/* ───────── Constants ───────── */
const specSuggestions = ["برند", "مدل", "پورت", "وزن", "توان خروجی", "ظرفیت", "طول کابل", "جنس", "ابعاد", "گارانتی", "کشور سازنده"]

const presetColors: ProductColor[] = [
    { name: "مشکی", hex: "#111827" },
    { name: "سفید", hex: "#ffffff" },
    { name: "خاکستری", hex: "#9ca3af" },
    { name: "نقره‌ای", hex: "#d1d5db" },
    { name: "طلایی", hex: "#d4af37" },
    { name: "قرمز", hex: "#ef4444" },
    { name: "نارنجی", hex: "#f97316" },
    { name: "زرد", hex: "#eab308" },
    { name: "سبز", hex: "#22c55e" },
    { name: "آبی", hex: "#3b82f6" },
    { name: "بنفش", hex: "#8b5cf6" },
    { name: "صورتی", hex: "#ec4899" },
]

const discountShortcuts = [0, 5, 10, 15, 20, 30, 50]

const inputCls = "w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 focus:border-primary-400 rounded-lg outline-none transition-colors"
const labelCls = "block mb-1.5 text-xs text-zinc-500"
const errCls = "block mt-1 text-[11px] text-red-500"

/* ───────── Helpers ───────── */
const digits = (value: string) => value.replace(/\D/g, "")
const fmt = (value: string) => (value ? Number(value).toLocaleString("en-US") : "")
const toNum = (value: string) => Number(value) || 0
const calcFinal = (base: number, pct: number) => Math.round(base * (1 - pct / 100))
const calcPct = (base: number, final: number) => (base <= 0 || final >= base ? 0 : Math.round((1 - final / base) * 100))

export interface ColorFormValue {
    name: string
    hex: string
    stock: string
    customPrice: boolean
    basePrice: string
    discount: string
    price: string
}

const emptyColor = (color: ProductColor): ColorFormValue => ({
    name: color.name,
    hex: color.hex,
    stock: "",
    customPrice: false,
    basePrice: "",
    discount: "",
    price: "",
})

function getColorError(color: ColorFormValue): string | null {
    if (color.stock === "" || !Number.isInteger(Number(color.stock)) || Number(color.stock) < 0) {
        return `موجودی رنگ «${color.name}» را وارد کنید`
    }
    if (color.customPrice) {
        const price = Number(color.price)
        const base = Number(color.basePrice)
        if (!price || price <= 0) return `قیمت نهایی رنگ «${color.name}» را وارد کنید`
        if (base && price > base) return `قیمت نهایی رنگ «${color.name}» نمی‌تواند از قیمت اصلی آن بیشتر باشد`
    }
    return null
}

export interface ProductFormValues {
    name: string
    linkName: string
    basePrice: string
    discount: string
    price: string
    stock: string
    category: string
    subCategory: string
    description: string
    isFeatured: boolean
    tags: string[]
    colorOptions: ColorFormValue[]
    specs: ProductSpec[]
}

const emptyValues: ProductFormValues = {
    name: "",
    linkName: "",
    basePrice: "",
    discount: "",
    price: "",
    stock: "",
    category: "",
    subCategory: "",
    description: "",
    isFeatured: false,
    tags: [],
    colorOptions: [],
    specs: [],
}

function getInitialValues(product?: AdminProduct): ProductFormValues {
    if (!product) return emptyValues

    const base = product.exPrice && product.exPrice > product.price ? product.exPrice : product.price

    const legacyColors: ColorFormValue[] = (product.colors ?? "")
        .split(/[،,]/)
        .map(name => name.trim())
        .filter(Boolean)
        .map(name => emptyColor({ name, hex: "#9ca3af" }))

    const savedColors: ColorFormValue[] = (product.colorOptions ?? []).map(color => {
        const hasCustomPrice = typeof color.price === "number" && color.price > 0
        const colorBase = hasCustomPrice ? (color.exPrice && color.exPrice > color.price! ? color.exPrice : color.price!) : 0
        return {
            name: color.name,
            hex: color.hex,
            // رنگ قدیمی بدون موجودی خالی می‌ماند تا ادمین مقدار را وارد کند
            stock: typeof color.stock === "number" ? String(color.stock) : "",
            customPrice: hasCustomPrice,
            basePrice: hasCustomPrice ? String(colorBase) : "",
            discount: hasCustomPrice ? String(calcPct(colorBase, color.price!)) : "",
            price: hasCustomPrice ? String(color.price) : "",
        }
    })

    return {
        name: product.name ?? "",
        linkName: product.linkName ?? "",
        basePrice: String(base),
        discount: String(calcPct(base, product.price)),
        price: String(product.price),
        stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : "",
        category: product.category ?? "",
        subCategory: product.subCategory ?? "",
        description: product.description ?? "",
        isFeatured: product.isFeatured === true,
        tags: product.tags ?? [],
        colorOptions: savedColors.length ? savedColors : legacyColors,
        specs: product.specs ?? [],
    }
}

const validationSchema = Yup.object({
    name: Yup.string().trim().min(3, "نام محصول حداقل ۳ حرف باشد").required("نام محصول الزامی است"),
    linkName: Yup.string()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "فقط حروف انگلیسی، عدد و خط تیره (مثال: cerby-890)")
        .required("نام لینک الزامی است"),
    basePrice: Yup.number().typeError("قیمت باید عدد باشد").positive("قیمت باید بیشتر از صفر باشد").required("قیمت اصلی الزامی است"),
    discount: Yup.number()
        .transform((value, original) => (original === "" ? 0 : value))
        .typeError("درصد تخفیف باید عدد باشد")
        .min(0, "حداقل ۰")
        .max(100, "حداکثر ۱۰۰"),
    price: Yup.number()
        .typeError("قیمت نهایی باید عدد باشد")
        .positive("قیمت نهایی باید بیشتر از صفر باشد")
        .max(Yup.ref("basePrice"), "قیمت نهایی نمی‌تواند از قیمت اصلی بیشتر باشد")
        .required("قیمت نهایی الزامی است"),
    stock: Yup.number().when("colorOptions", {
        is: (colors: ColorFormValue[] | undefined) => (colors?.length ?? 0) > 0,
        then: schema => schema.transform((value, original) => (original === "" ? 0 : value)).notRequired(),
        otherwise: schema =>
            schema.typeError("موجودی باید عدد باشد").integer("موجودی باید عدد صحیح باشد").min(0, "موجودی نمی‌تواند منفی باشد").required("موجودی الزامی است"),
    }),
    colorOptions: Yup.array().test("color-rows", "", function (list) {
        for (const color of (list ?? []) as ColorFormValue[]) {
            const message = getColorError(color)
            if (message) return this.createError({ message })
        }
        return true
    }),
    category: Yup.string().required("انتخاب دسته‌بندی الزامی است"),
    subCategory: Yup.string().required("انتخاب زیرمجموعه الزامی است"),
    description: Yup.string().max(5000, "حداکثر ۵۰۰۰ کاراکتر"),
    specs: Yup.array().test(
        "spec-pairs",
        "هر ویژگی باید هم عنوان و هم مقدار داشته باشد",
        list => ((list ?? []) as ProductSpec[]).every(spec => !!spec?.label?.trim() === !!spec?.value?.trim())
    ),
})

/* ───────── Small UI pieces ───────── */
function Section({ icon: Icon, title, hint, children }: { icon: IconType; title: string; hint?: string; children: ReactNode }) {
    return (
        <section className="p-4 sm:p-5 border border-gray-100 bg-gray-50/40 rounded-2xl">
            <div className="flex items-start gap-2 pb-3 mb-4 border-b border-gray-100">
                <Icon className="w-5 h-5 mt-0.5 text-primary-500 shrink-0" />
                <div>
                    <h3 className="font-IranYekanBold text-sm sm:text-base text-zinc-800">{title}</h3>
                    {hint && <p className="mt-0.5 text-xs text-zinc-400 leading-5">{hint}</p>}
                </div>
            </div>
            {children}
        </section>
    )
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={onChange}
            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? "bg-primary-500" : "bg-gray-300"}`}
        >
            <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all ${checked ? "right-0.5" : "right-4.5"}`} />
        </button>
    )
}

/* ───────── Price ───────── */
function PriceFields() {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<ProductFormValues>()
    const base = toNum(values.basePrice)
    const pct = toNum(values.discount)
    const final = toNum(values.price)
    const saved = base > final ? base - final : 0

    const onBase = (raw: string) => {
        const d = digits(raw)
        setFieldValue("basePrice", d)
        setFieldValue("price", d ? String(calcFinal(Number(d), pct)) : "")
    }

    const onPct = (raw: string) => {
        let d = digits(raw).slice(0, 3)
        if (Number(d) > 100) d = "100"
        setFieldValue("discount", d)
        if (base) setFieldValue("price", String(calcFinal(base, Number(d))))
    }

    const onFinal = (raw: string) => {
        const d = digits(raw)
        setFieldValue("price", d)
        const f = Number(d)
        if (!f) return
        if (!base || f > base) {
            setFieldValue("basePrice", d)
            setFieldValue("discount", "0")
            return
        }
        setFieldValue("discount", String(calcPct(base, f)))
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className={labelCls}>قیمت اصلی (تومان) *</label>
                    <input
                        inputMode="numeric"
                        dir="ltr"
                        value={fmt(values.basePrice)}
                        onChange={e => onBase(e.target.value)}
                        onBlur={() => setFieldTouched("basePrice", true)}
                        placeholder="850,000"
                        className={`${inputCls} text-left`}
                    />
                    <ErrorMessage name="basePrice" component="span" className={errCls} />
                </div>

                <div>
                    <label className={labelCls}>درصد تخفیف</label>
                    <div className="relative">
                        <input
                            inputMode="numeric"
                            dir="ltr"
                            value={values.discount === "0" ? "" : values.discount}
                            onChange={e => onPct(e.target.value)}
                            onBlur={() => setFieldTouched("discount", true)}
                            placeholder="0"
                            className={`${inputCls} text-left pr-9`}
                        />
                        <PiPercentLight className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                    <ErrorMessage name="discount" component="span" className={errCls} />
                </div>

                <div>
                    <label className={labelCls}>قیمت نهایی فروش (تومان) *</label>
                    <input
                        inputMode="numeric"
                        dir="ltr"
                        value={fmt(values.price)}
                        onChange={e => onFinal(e.target.value)}
                        onBlur={() => setFieldTouched("price", true)}
                        placeholder="595,000"
                        className={`${inputCls} text-left bg-primary-50/60 border-primary-200 font-IranYekanMedium`}
                    />
                    <ErrorMessage name="price" component="span" className={errCls} />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-xs text-zinc-400">تخفیف سریع:</span>
                {discountShortcuts.map(p => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPct(String(p))}
                        disabled={!base}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                            ${pct === p ? "bg-primary-500 border-primary-500 text-white" : "bg-white border-gray-200 text-zinc-500 hover:border-primary-400 hover:text-primary-600"}`}
                    >
                        {p === 0 ? "بدون تخفیف" : `${p.toLocaleString("fa-IR")}٪`}
                    </button>
                ))}
            </div>

            <p className="mt-3 text-xs leading-6 text-zinc-500">
                {saved > 0
                    ? <>مشتری <b className="text-primary-700">{saved.toLocaleString("en-US")}</b> تومان سود می‌کند؛ قیمت اصلی به‌صورت خط‌خورده کنار قیمت نهایی نمایش داده می‌شود.</>
                    : "بدون تخفیف؛ فقط قیمت نهایی نمایش داده می‌شود. با وارد کردن درصد تخفیف، قیمت نهایی خودکار محاسبه می‌شود (یا قیمت نهایی را دستی بنویسید تا درصد محاسبه شود)."}
            </p>
        </div>
    )
}

/* ───────── Specs (label: value) ───────── */
function SpecsField() {
    const { values, setFieldValue, errors } = useFormikContext<ProductFormValues>()
    const specs = values.specs
    const [focusTarget, setFocusTarget] = useState<{ index: number; field: "label" | "value" } | null>(null)

    useEffect(() => {
        if (!focusTarget) return
        document.getElementById(`spec-${focusTarget.field}-${focusTarget.index}`)?.focus()
        setFocusTarget(null)
    }, [focusTarget])

    const update = (index: number, patch: Partial<ProductSpec>) =>
        setFieldValue("specs", specs.map((spec, i) => (i === index ? { ...spec, ...patch } : spec)))

    const add = (label = "") => {
        if (specs.length >= 30) return
        setFieldValue("specs", [...specs, { label, value: "" }])
        setFocusTarget({ index: specs.length, field: label ? "value" : "label" })
    }

    const remove = (index: number) => setFieldValue("specs", specs.filter((_, i) => i !== index))

    const onValueKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key !== "Enter") return
        event.preventDefault()
        if (index === specs.length - 1) add()
        else setFocusTarget({ index: index + 1, field: "value" })
    }

    const usedLabels = new Set(specs.map(spec => spec.label.trim()))
    const unusedSuggestions = specColorSafe(specSuggestions, usedLabels)

    return (
        <div>
            <datalist id="spec-labels">
                {specSuggestions.map(label => <option key={label} value={label} />)}
            </datalist>

            {specs.length === 0 ? (
                <p className="py-4 text-center text-xs text-zinc-400">
                    هنوز ویژگی‌ای اضافه نشده. هر عنوانی را می‌توانید بنویسید؛ مثلاً «پورت» با مقدار «USB».
                </p>
            ) : (
                <div className="flex flex-col gap-2.5">
                    {specs.map((spec, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <input
                                id={`spec-label-${index}`}
                                list="spec-labels"
                                value={spec.label}
                                onChange={e => update(index, { label: e.target.value })}
                                maxLength={40}
                                placeholder="عنوان (مثال: پورت)"
                                className={`${inputCls} w-2/5`}
                            />
                            <span className="pt-2.5 text-zinc-300">:</span>
                            <input
                                id={`spec-value-${index}`}
                                value={spec.value}
                                onChange={e => update(index, { value: e.target.value })}
                                onKeyDown={e => onValueKeyDown(e, index)}
                                maxLength={200}
                                placeholder="مقدار (مثال: USB)"
                                className={`${inputCls} min-w-0`}
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                aria-label="حذف ویژگی"
                                className="flex-center w-10 h-10 shrink-0 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <PiTrashLight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {typeof errors.specs === "string" && <span className={errCls}>{errors.specs}</span>}

            <div className="flex flex-wrap items-center gap-2 mt-4">
                <button
                    type="button"
                    onClick={() => add()}
                    className="flex-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm text-primary-600 hover:text-primary-700 bg-white border border-dashed border-primary-300 hover:border-primary-400 rounded-lg transition-colors cursor-pointer"
                >
                    <PiPlusCircleLight className="w-4 h-4" />
                    افزودن ویژگی
                </button>

                {unusedSuggestions.length > 0 && (
                    <>
                        <span className="text-xs text-zinc-400 mr-1">پیشنهاد:</span>
                        {unusedSuggestions.slice(0, 7).map(label => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => add(label)}
                                className="px-2.5 py-1 text-xs text-zinc-500 bg-white border border-gray-200 hover:border-primary-400 hover:text-primary-600 rounded-lg transition-colors cursor-pointer"
                            >
                                + {label}
                            </button>
                        ))}
                    </>
                )}
            </div>
            <p className="mt-2 text-[11px] text-zinc-400">در فیلد مقدار، Enter بزنید تا ردیف بعدی باز شود.</p>
        </div>
    )
}

function specColorSafe(list: string[], used: Set<string>) {
    return list.filter(item => !used.has(item))
}

/* ───────── Colors ───────── */
function ColorPriceEditor({ color, onChange }: { color: ColorFormValue; onChange: (patch: Partial<ColorFormValue>) => void }) {
    const base = toNum(color.basePrice)
    const pct = toNum(color.discount)
    const final = toNum(color.price)
    const saved = base > final ? base - final : 0

    const onBase = (raw: string) => {
        const d = digits(raw)
        onChange({ basePrice: d, price: d ? String(calcFinal(Number(d), pct)) : "" })
    }

    const onPct = (raw: string) => {
        let d = digits(raw).slice(0, 3)
        if (Number(d) > 100) d = "100"
        onChange({ discount: d, ...(base ? { price: String(calcFinal(base, Number(d))) } : {}) })
    }

    const onFinal = (raw: string) => {
        const d = digits(raw)
        const f = Number(d)
        if (!f) return onChange({ price: d })
        if (!base || f > base) return onChange({ price: d, basePrice: d, discount: "0" })
        onChange({ price: d, discount: String(calcPct(base, f)) })
    }

    return (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className={labelCls}>قیمت اصلی (تومان)</label>
                    <input inputMode="numeric" dir="ltr" value={fmt(color.basePrice)} onChange={e => onBase(e.target.value)} placeholder="850,000" className={`${inputCls} text-left`} />
                </div>
                <div>
                    <label className={labelCls}>درصد تخفیف</label>
                    <div className="relative">
                        <input
                            inputMode="numeric"
                            dir="ltr"
                            value={color.discount === "0" ? "" : color.discount}
                            onChange={e => onPct(e.target.value)}
                            placeholder="0"
                            className={`${inputCls} text-left pr-9`}
                        />
                        <PiPercentLight className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className={labelCls}>قیمت نهایی این رنگ *</label>
                    <input
                        inputMode="numeric"
                        dir="ltr"
                        value={fmt(color.price)}
                        onChange={e => onFinal(e.target.value)}
                        placeholder="595,000"
                        className={`${inputCls} text-left bg-primary-50/60 border-primary-200 font-IranYekanMedium`}
                    />
                </div>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-zinc-500">
                {saved > 0
                    ? <>مشتری با خرید این رنگ <b className="text-primary-700">{saved.toLocaleString("en-US")}</b> تومان سود می‌کند.</>
                    : "بدون تخفیف برای این رنگ."}
            </p>
        </div>
    )
}

function ColorsField() {
    const { values, setFieldValue, errors } = useFormikContext<ProductFormValues>()
    const colors = values.colorOptions
    const [name, setName] = useState("")
    const [hex, setHex] = useState("#9fbe23")

    const exists = (colorName: string) => colors.some(color => color.name === colorName.trim())
    const totalStock = colors.reduce((sum, color) => sum + toNum(color.stock), 0)

    const addColor = (color: ProductColor) => {
        const colorName = color.name.trim()
        if (!colorName || exists(colorName) || colors.length >= 20) return
        setFieldValue("colorOptions", [...colors, emptyColor({ name: colorName, hex: color.hex })])
    }

    const removeColor = (colorName: string) =>
        setFieldValue("colorOptions", colors.filter(color => color.name !== colorName))

    const updateColor = (index: number, patch: Partial<ColorFormValue>) =>
        setFieldValue(`colorOptions.${index}`, { ...colors[index], ...patch })

    const toggleCustomPrice = (index: number) => {
        const color = colors[index]
        if (color.customPrice) return updateColor(index, { customPrice: false })
        updateColor(index, {
            customPrice: true,
            basePrice: color.basePrice || values.basePrice,
            discount: color.discount || values.discount,
            price: color.price || values.price,
        })
    }

    const submitCustom = () => {
        addColor({ name, hex })
        setName("")
    }

    const listError = typeof errors.colorOptions === "string" ? errors.colorOptions : ""

    return (
        <div>
            {colors.length > 0 && (
                <div className="flex flex-col gap-3 mb-4">
                    {colors.map((color, index) => {
                        const rowError = getColorError(color)
                        const light = isLightColor(color.hex)
                        return (
                            <div key={color.name} className={`p-3.5 bg-white border rounded-xl ${rowError ? "border-red-200" : "border-gray-200"}`}>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <i
                                            className={`w-7 h-7 shrink-0 rounded-full border ${light ? "border-gray-300" : "border-black/10"}`}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="text-sm font-IranYekanMedium text-zinc-700 truncate">{color.name}</span>
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-zinc-500 shrink-0">موجودی *</label>
                                        <input
                                            inputMode="numeric"
                                            value={color.stock}
                                            onChange={e => updateColor(index, { stock: digits(e.target.value) })}
                                            placeholder="تعداد"
                                            aria-label={`موجودی رنگ ${color.name}`}
                                            className={`${inputCls} w-24 text-center`}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeColor(color.name)}
                                        aria-label={`حذف رنگ ${color.name}`}
                                        className="flex-center w-9 h-9 shrink-0 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <PiTrashLight className="w-4 h-4" />
                                    </button>
                                </div>

                                <label className="flex items-center gap-2.5 mt-3 cursor-pointer w-fit">
                                    <ToggleSwitch checked={color.customPrice} onChange={() => toggleCustomPrice(index)} label={`قیمت اختصاصی برای ${color.name}`} />
                                    <span className="text-xs text-zinc-600">قیمت / تخفیف اختصاصی برای این رنگ</span>
                                </label>
                                {!color.customPrice && (
                                    <p className="mt-1.5 text-[11px] text-zinc-400">قیمت و تخفیف پایه‌ی محصول اعمال می‌شود.</p>
                                )}

                                {color.customPrice && <ColorPriceEditor color={color} onChange={patch => updateColor(index, patch)} />}
                            </div>
                        )
                    })}

                    <div className="flex items-center justify-between px-3.5 py-2.5 text-xs bg-primary-50/60 border border-primary-100 rounded-xl">
                        <span className="text-zinc-500">موجودی کل محصول (جمع رنگ‌ها)</span>
                        <b className="text-primary-700">{totalStock.toLocaleString("fa-IR")} عدد</b>
                    </div>
                    {listError && <span className={errCls}>{listError}</span>}
                </div>
            )}

            <p className="mb-2 text-xs text-zinc-400">رنگ‌های متداول (با کلیک اضافه یا حذف می‌شوند):</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {presetColors.map(preset => {
                    const active = exists(preset.name)
                    return (
                        <button
                            key={preset.name}
                            type="button"
                            onClick={() => (active ? removeColor(preset.name) : addColor(preset))}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer
                                ${active ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 bg-white text-zinc-500 hover:border-primary-300"}`}
                        >
                            <i className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: preset.hex }} />
                            {preset.name}
                        </button>
                    )
                })}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={hex}
                    onChange={e => setHex(e.target.value)}
                    aria-label="انتخاب رنگ"
                    className="w-10 h-10 p-1 bg-white border border-gray-200 rounded-lg cursor-pointer shrink-0"
                />
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            submitCustom()
                        }
                    }}
                    maxLength={30}
                    placeholder="رنگ دلخواه؛ مثال: سرمه‌ای"
                    className={`${inputCls} flex-1 min-w-0`}
                />
                <button
                    type="button"
                    onClick={submitCustom}
                    disabled={!name.trim() || exists(name)}
                    className="flex-center gap-1.5 h-10 px-4 text-sm text-text linear_btn shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <PiPlusCircleLight className="w-4 h-4" />
                    افزودن
                </button>
            </div>
        </div>
    )
}

/* ───────── Tags ───────── */
function TagsField() {
    const { values, setFieldValue } = useFormikContext<ProductFormValues>()
    const [draft, setDraft] = useState("")

    const commit = (raw: string) => {
        const parts = raw.split(/[,،]/).map(tag => tag.trim()).filter(Boolean)
        if (!parts.length) return
        const next = [...values.tags]
        parts.forEach(tag => {
            if (!next.includes(tag) && next.length < 20) next.push(tag)
        })
        setFieldValue("tags", next)
        setDraft("")
    }

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === "," || event.key === "،") {
            event.preventDefault()
            commit(draft)
        } else if (event.key === "Backspace" && !draft && values.tags.length) {
            setFieldValue("tags", values.tags.slice(0, -1))
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2 px-2.5 py-2 bg-white border border-gray-200 focus-within:border-primary-400 rounded-lg transition-colors">
            {values.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 pl-1 pr-2.5 py-1 text-xs text-primary-700 bg-primary-50 rounded-full">
                    {tag}
                    <button
                        type="button"
                        onClick={() => setFieldValue("tags", values.tags.filter(item => item !== tag))}
                        aria-label={`حذف برچسب ${tag}`}
                        className="flex-center w-4 h-4 hover:text-danger cursor-pointer"
                    >
                        <PiXBold className="w-3 h-3" />
                    </button>
                </span>
            ))}
            <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => commit(draft)}
                placeholder={values.tags.length ? "" : "تایپ کنید و Enter بزنید..."}
                className="flex-1 min-w-32 py-1 text-sm bg-transparent outline-none placeholder:text-zinc-400"
            />
        </div>
    )
}

/* ───────── Featured toggle ───────── */
function FeaturedField() {
    const { values, setFieldValue } = useFormikContext<ProductFormValues>()
    return (
        <div className={`p-3.5 border rounded-xl transition-colors ${values.isFeatured ? "border-primary-300 bg-primary-50/60" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-sm text-zinc-700">
                    <PiStarFill className={`w-4 h-4 ${values.isFeatured ? "text-amber-500" : "text-zinc-300"}`} />
                    محصول ویژه
                </span>
                <ToggleSwitch checked={values.isFeatured} onChange={() => setFieldValue("isFeatured", !values.isFeatured)} label="محصول ویژه" />
            </div>
            <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                در اسلایدر «محصولات ویژه» صفحه‌ی اصلی نمایش داده می‌شود (فقط اگر موجودی داشته باشد).
            </p>
        </div>
    )
}

/* ───────── Main Form ───────── */
type ProductFormProps = {
    mode: "add" | "edit"
    product?: AdminProduct
    categories: CategoryData[]
    onSuccess?: () => void
    onCancel?: () => void
}

type NewImage = { file: File; preview: string }

export default function ProductForm({ mode, product, categories, onSuccess, onCancel }: ProductFormProps) {
    const isEdit = mode === "edit" && !!product
    const [isPending, startTransition] = useTransition()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [existingImages, setExistingImages] = useState<string[]>(
        isEdit ? [product!.img, ...(product!.images ?? [])].filter(Boolean) : []
    )
    const [newImages, setNewImages] = useState<NewImage[]>([])

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])
        if (!files.length) return
        const valid = files.filter(file => file.type.startsWith("image/"))
        setNewImages(prev => [...prev, ...valid.map(file => ({ file, preview: URL.createObjectURL(file) }))])
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const removeNewImage = (index: number) => {
        setNewImages(prev => {
            URL.revokeObjectURL(prev[index].preview)
            return prev.filter((_, i) => i !== index)
        })
    }

    const clearNewImages = () => {
        newImages.forEach(item => URL.revokeObjectURL(item.preview))
        setNewImages([])
    }

    const buildPayload = (values: ProductFormValues) => {
        const price = toNum(values.price)
        const base = toNum(values.basePrice)
        const hasDiscount = base > price

        const payload = new FormData()
        payload.append("name", values.name.trim())
        payload.append("linkName", values.linkName.trim())
        payload.append("price", String(price))
        payload.append("exPrice", hasDiscount ? String(base) : "")
        payload.append("discount", String(hasDiscount ? calcPct(base, price) : 0))
        payload.append("stock", values.colorOptions.length ? String(values.colorOptions.reduce((sum, color) => sum + toNum(color.stock), 0)) : values.stock)
        payload.append("category", values.category)
        payload.append("subCategory", values.subCategory)
        payload.append("description", values.description)
        payload.append("isFeatured", String(values.isFeatured))
        payload.append("tags", values.tags.join(","))
        payload.append(
            "colorOptions",
            JSON.stringify(
                values.colorOptions.map(color => {
                    const finalPrice = toNum(color.price)
                    const colorBase = toNum(color.basePrice)
                    return {
                        name: color.name,
                        hex: color.hex,
                        stock: toNum(color.stock),
                        ...(color.customPrice && finalPrice > 0
                            ? { price: finalPrice, exPrice: colorBase > finalPrice ? colorBase : null }
                            : {}),
                    }
                })
            )
        )
        payload.append("specs", JSON.stringify(values.specs.filter(spec => spec.label.trim() && spec.value.trim())))

        if (isEdit) {
            payload.append("existingImages", JSON.stringify(existingImages))
            newImages.forEach(item => payload.append("newImages", item.file))
        } else {
            newImages.forEach(item => payload.append("images", item.file))
        }
        return payload
    }

    const handleSubmit = (values: ProductFormValues, { setSubmitting, resetForm }: { setSubmitting: (value: boolean) => void; resetForm: () => void }) => {
        if (!existingImages.length && !newImages.length) {
            Swal.fire({ icon: "error", title: "خطا", text: "حداقل یک تصویر محصول الزامی است" })
            setSubmitting(false)
            return
        }

        const payload = buildPayload(values)

        startTransition(async () => {
            const result = isEdit ? await updateProductAction(product!._id, payload) : await addProductAction(payload)

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "موفقیت‌آمیز",
                    text: isEdit ? "محصول با موفقیت ویرایش شد" : "محصول با موفقیت ذخیره شد",
                    timer: 1500,
                    showConfirmButton: false,
                })
                if (!isEdit) {
                    resetForm()
                    clearNewImages()
                }
                onSuccess?.()
            } else {
                Swal.fire({ icon: "error", title: "خطا", text: result.error || "مشکلی در ذخیره محصول پیش آمد" })
            }
            setSubmitting(false)
        })
    }

    const totalImages = existingImages.length + newImages.length

    return (
        <Formik initialValues={getInitialValues(product)} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, dirty, isValid, submitCount, handleReset }) => {
                const submitting = isSubmitting || isPending

                return (
                    <Form>
                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* ───── Right column: images + featured ───── */}
                            <div className="w-full lg:w-56 shrink-0 flex flex-col gap-4">
                                <div>
                                    <label className={labelCls}>تصاویر محصول *</label>
                                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 lg:grid-cols-2 gap-2">
                                        {existingImages.map((src, index) => (
                                            <div key={`existing-${src}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                                                <img src={src} className="w-full h-full object-cover" alt={`تصویر ${index + 1}`} />
                                                {index === 0 && <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] text-white bg-primary-600/90 rounded-md">اصلی</span>}
                                                <button
                                                    type="button"
                                                    onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== index))}
                                                    aria-label="حذف تصویر"
                                                    className="absolute top-1 left-1 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
                                                >
                                                    <PiXCircleFill className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}

                                        {newImages.map((item, index) => (
                                            <div key={item.preview} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary-300">
                                                <img src={item.preview} className="w-full h-full object-cover" alt={`تصویر جدید ${index + 1}`} />
                                                {existingImages.length + index === 0 && <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] text-white bg-primary-600/90 rounded-md">اصلی</span>}
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    aria-label="حذف تصویر"
                                                    className="absolute top-1 left-1 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
                                                >
                                                    <PiXCircleFill className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}

                                        {totalImages < 10 && (
                                            <label className="flex flex-col items-center justify-center gap-1 aspect-square border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl cursor-pointer text-zinc-400 hover:text-primary-500 transition-colors">
                                                <PiImageLight className="w-7 h-7" />
                                                <span className="text-[10px]">افزودن عکس</span>
                                                <input ref={fileInputRef} onChange={handleImageChange} type="file" accept="image/*" multiple className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                    <p className="mt-1.5 text-[11px] leading-5 text-zinc-400">اولین عکس، تصویر اصلی است. حداکثر ۱۰ عکس، هر کدام تا ۵ مگابایت.</p>
                                </div>

                                <FeaturedField />
                            </div>

                            {/* ───── Left column: fields ───── */}
                            <div className="flex-1 min-w-0 flex flex-col gap-5">

                                <Section icon={PiPackageLight} title="اطلاعات پایه">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className={labelCls}>نام محصول *</label>
                                            <Field name="name" placeholder="مثال: هندزفری بلوتوثی کربی مدل CR-T107" className={inputCls} />
                                            <ErrorMessage name="name" component="span" className={errCls} />
                                        </div>

                                        <div>
                                            <label className={labelCls}>نام لینک (انگلیسی) *</label>
                                            <Field name="linkName">
                                                {({ field, form }: FieldProps<string>) => (
                                                    <input
                                                        {...field}
                                                        dir="ltr"
                                                        placeholder="cerby-107"
                                                        onChange={e =>
                                                            form.setFieldValue("linkName", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
                                                        }
                                                        className={`${inputCls} text-left`}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="linkName" component="span" className={errCls} />
                                        </div>

                                        <div>
                                            <label className={`${labelCls} flex items-center gap-1.5`}>
                                                <PiStackLight className="w-3.5 h-3.5" />
                                                موجودی انبار *
                                            </label>
                                            <Field name="stock">
                                                {({ field, form }: FieldProps<string>) => {
                                                    const colorList = form.values.colorOptions as ColorFormValue[]
                                                    const hasColors = colorList.length > 0
                                                    const sum = colorList.reduce((total, color) => total + toNum(color.stock), 0)
                                                    return (
                                                        <>
                                                            <input
                                                                {...field}
                                                                value={hasColors ? String(sum) : field.value}
                                                                readOnly={hasColors}
                                                                inputMode="numeric"
                                                                placeholder="تعداد"
                                                                onChange={e => form.setFieldValue("stock", digits(e.target.value))}
                                                                className={`${inputCls} ${hasColors ? "bg-gray-50 text-zinc-500 cursor-not-allowed" : ""}`}
                                                            />
                                                            {hasColors && <p className="mt-1 text-[11px] text-zinc-400">محصول رنگی است؛ موجودی هر رنگ را در بخش «رنگ‌ها» وارد کنید.</p>}
                                                        </>
                                                    )
                                                }}
                                            </Field>
                                            <ErrorMessage name="stock" component="span" className={errCls} />
                                        </div>
                                        <CategoryAndSubCategoryFields categories={categories} />
                                    </div>
                                </Section>

                                <Section icon={PiPercentLight} title="قیمت‌گذاری" hint="قیمت پایه‌ی محصول (برای رنگ‌هایی که قیمت اختصاصی ندارند). قیمت اصلی و درصد تخفیف را بنویسید؛ قیمت نهایی خودکار محاسبه می‌شود.">
                                    <PriceFields />
                                </Section>

                                <Section icon={PiPaletteLight} title="رنگ‌ها" hint="اختیاری؛ برای هر رنگ موجودی و در صورت نیاز قیمت و تخفیف اختصاصی تعیین کنید. رنگِ بدون موجودی در سایت غیرفعال می‌شود.">
                                    <ColorsField />
                                </Section>

                                <Section icon={PiListBulletsLight} title="ویژگی‌ها و مشخصات فنی" hint="هر ویژگی را با عنوان دلخواه اضافه کنید؛ مثلاً «پورت: USB». در صفحه‌ی محصول نمایش داده می‌شود.">
                                    <SpecsField />
                                </Section>

                                <Section icon={PiTextAlignRightLight} title="توضیحات و برچسب‌ها">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className={labelCls}>توضیحات (اختیاری)</label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                rows={6}
                                                placeholder="معرفی محصول، نکات مهم و توضیحات تکمیلی"
                                                className={`${inputCls} resize-y leading-7`}
                                            />
                                            <ErrorMessage name="description" component="span" className={errCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>برچسب‌ها (اختیاری)</label>
                                            <TagsField />
                                        </div>
                                    </div>
                                </Section>
                            </div>
                        </div>

                        {/* ───── Actions ───── */}
                        <div className="sticky bottom-0 z-10 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-7 px-4 sm:px-6 py-4 bg-white/95 backdrop-blur-sm border-t border-gray-100 rounded-b-2xl">
                            {submitCount > 0 && !isValid && (
                                <p className="mb-3 text-xs text-red-500">چند فیلد نیاز به اصلاح دارند؛ موارد قرمز را بررسی کنید.</p>
                            )}
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
                                {isEdit ? (
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        className="px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                                    >
                                        انصراف
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleReset()
                                            clearNewImages()
                                        }}
                                        className="px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                                    >
                                        پاک کردن فرم
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting || (!isEdit && !dirty)}
                                    className="flex-center gap-1.5 px-6 py-2.5 text-sm text-text linear_btn disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PiFloppyDiskLight className="w-4 h-4" />
                                    {submitting ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ذخیره محصول"}
                                </button>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    )
}
