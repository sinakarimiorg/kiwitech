import type { IconType } from 'react-icons'

type StatCardProps = {
    label: string
    value: string
    icon: IconType
    trend?: { value: string; positive: boolean }
    accent: 'primary' | 'neon' | 'danger'
}

const accentMap: Record<StatCardProps['accent'], string> = {
    primary: 'bg-primary-50 text-primary-600',
    neon: 'bg-neon-soft text-primary-700',
    danger: 'bg-danger/10 text-danger',
}

export default function StatCard({ label, value, icon: Icon, trend, accent }: StatCardProps) {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-5 transition-all duration-300
         ease-out hover:-translate-y-2 hover:rotate-2 hover:scale-105 hover:shadow-2xl
         hover:shadow-zinc-300/60 cursor-pointer">
            <div className="flex items-start justify-between">
                <span className={`flex-center w-11 h-11 rounded-xl ${accentMap[accent]}`}>
                    <Icon className="w-6 h-6" />
                </span>
                {trend && (
                    <span className={`text-xs font-IranYekanMedium ${trend.positive ? 'text-primary-600' : 'text-danger'}`}>
                        {trend.positive ? '↑' : '↓'} {trend.value}
                    </span>
                )}
            </div>
            <p className="mt-4 font-IranYekanBold text-2xl text-zinc-800">{value}</p>
            <p className="mt-1 text-sm text-zinc-400">{label}</p>
        </div>
    )
}
