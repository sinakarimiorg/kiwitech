import { PiPlusCircleLight, PiMinusCircleLight, PiShoppingCartLight, PiWalletLight, PiListMagnifyingGlassLight } from "react-icons/pi"
import type { IconType } from "react-icons"
import TomanIcon from "@root/src/components/modules/Icons/TomanIcon"
import type { UserWalletTransaction, WalletTransactionType } from "@root/src/types/userWalletType"


const typeMeta: Record<WalletTransactionType, { icon: IconType; color: string; positive: boolean }> = {
  "واریز": { icon: PiPlusCircleLight, color: "text-primary-600 bg-primary-50", positive: true },
  "برداشت": { icon: PiMinusCircleLight, color: "text-danger bg-danger/10", positive: false },
  "خرید": { icon: PiShoppingCartLight, color: "text-sky-600 bg-sky-50", positive: false },
  "بازگشت وجه": { icon: PiWalletLight, color: "text-amber-600 bg-amber-50", positive: true },
}

export default function WalletTransactionsList({ transactions }: { transactions: UserWalletTransaction[] }) {
  return (
    <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
      <div className='flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-gray-100'>
        <PiListMagnifyingGlassLight className='w-5 h-5 text-primary-500' />
        <h2 className='font-IranYekanBold text-base sm:text-lg text-zinc-800'>تراکنش‌های کیف پول</h2>
        <span className='text-xs font-IranYekan text-zinc-400'>({transactions.length})</span>
      </div>

      {transactions.length === 0 ? (
        <div className='py-14 text-center text-sm text-zinc-400'>هنوز تراکنشی ثبت نشده است.</div>
      ) : (
        <div className='divide-y divide-gray-50'>
          {transactions.map(tx => {
            const meta = typeMeta[tx.type]
            const Icon = meta.icon
            return (
              <div key={tx._id} className='flex items-center justify-between gap-3 px-5 sm:px-6 py-4'>
                <div className='flex items-center gap-3 min-w-0'>
                  <span className={`flex-center w-10 h-10 shrink-0 rounded-full ${meta.color}`}>
                    <Icon className='w-5 h-5' />
                  </span>
                  <div className='min-w-0'>
                    <p className='text-sm text-zinc-700 line-clamp-1'>{tx.description}</p>
                    <p className='text-xs text-zinc-400 mt-1'>
                      {new Date(tx.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-sm font-IranYekanMedium shrink-0 ${meta.positive ? 'text-primary-600' : 'text-zinc-700'}`}>
                  {meta.positive ? '+' : '−'}{tx.amount.toLocaleString()}
                  <TomanIcon className='w-3 h-3' />
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
