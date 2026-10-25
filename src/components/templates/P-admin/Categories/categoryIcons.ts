import type { IconType } from "react-icons"
import { FiSmartphone } from "react-icons/fi"
import { FaComputer, FaKitchenSet } from "react-icons/fa6"
import { VscPackage } from "react-icons/vsc"
import type { CategoryIconKey } from "@root/src/types/adminCategoryType"

export const categoryIconOptions: { key: CategoryIconKey; label: string; icon: IconType }[] = [
    { key: "smartphone", label: "موبایل", icon: FiSmartphone },
    { key: "computer", label: "کامپیوتر", icon: FaComputer },
    { key: "kitchen", label: "لوازم خانگی", icon: FaKitchenSet },
    { key: "package", label: "متفرقه", icon: VscPackage },
]

export const categoryIconMap: Record<string, IconType> = categoryIconOptions.reduce(
    (acc, opt) => ({ ...acc, [opt.key]: opt.icon }),
    {} as Record<string, IconType>
)
