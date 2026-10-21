"use client"

import { PiCheckBold } from "react-icons/pi"
import type { ProductColor } from "@root/src/types/adminProductType"
import { isLightColor } from "@root/src/lib/productVariants"

export type ColorOptionView = ProductColor & { available: boolean; stock: number; inCart?: number }

type ColorSelectorProps = {
    colors: ColorOptionView[]
    selected: string | null
    onSelect: (colorName: string) => void
    className?: string
}

export default function ColorSelector({ colors, selected, onSelect, className = "" }: ColorSelectorProps) {
    if (colors.length === 0) return null

    const current = colors.find(color => color.name === selected) ?? null
    const remaining = current ? Math.max(current.stock - (current.inCart ?? 0), 0) : 0
    const allInCart = !!current && current.available && remaining === 0
    const lowStock = !!current && current.available && !allInCart && remaining <= 3

    return (
        <div className={className}>
            <p className="pb-3 text-text-muted">
                رنگ:
                {current && <span className="mr-1.5 font-IranYekanMedium text-zinc-800">{current.name}</span>}
            </p>

            <div role="radiogroup" aria-label="انتخاب رنگ" className="flex flex-wrap items-center gap-3">
                {colors.map(color => {
                    const isSelected = color.name === selected
                    const light = isLightColor(color.hex)
                    const disabled = !color.available

                    return (
                        <button
                            key={color.name}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-disabled={disabled}
                            aria-label={disabled ? `${color.name} (ناموجود)` : color.name}
                            title={disabled ? `${color.name} — ناموجود` : color.name}
                            disabled={disabled}
                            onClick={() => onSelect(color.name)}
                            className={`relative flex-center w-10 h-10 rounded-full border transition-all duration-200 outline-none
                                focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
                                ${light ? "border-gray-300" : "border-black/10"}
                                ${isSelected ? "ring-2 ring-primary-500 ring-offset-2 scale-105" : ""}
                                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                            style={{ backgroundColor: color.hex }}
                        >
                            {isSelected && !disabled && (
                                <PiCheckBold className={`w-4 h-4 ${light ? "text-zinc-800" : "text-white"}`} />
                            )}
                            {disabled && (
                                <span
                                    aria-hidden
                                    className="absolute inset-x-1 top-1/2 h-0.5 -rotate-45 bg-zinc-500 rounded-full"
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {current && (
                <p className={`mt-3 text-xs ${!current.available ? "text-danger" : allInCart || lowStock ? "text-amber-600" : "text-primary-600"}`}>
                    {!current.available
                        ? "این رنگ ناموجود است"
                        : allInCart
                            ? "تمام موجودی این رنگ در سبد خرید شماست"
                            : lowStock
                                ? `تنها ${remaining.toLocaleString("fa-IR")} عدد از این رنگ باقی مانده`
                                : "موجود در انبار"}
                </p>
            )}
        </div>
    )
}