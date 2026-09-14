"use client"

import { useState } from "react"
import { PiWalletLight, PiPlusCircleLight } from "react-icons/pi"
import TomanIcon from "@root/src/components/modules/Icons/TomanIcon"
import TopUpModal from "./TopUpModal"

export default function WalletOverviewCard({ balance }: { balance: number }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='bg-linear-to-br from-primary-600 to-primary-500 text-white shadow-lg rounded-2xl p-6 sm:p-8'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex items-center gap-2.5'>
          <span className='flex-center w-11 h-11 bg-white/15 rounded-xl shrink-0'>
            <PiWalletLight className='w-6 h-6' />
          </span>
          <div>
            <p className='text-xs text-white/70'>موجودی کیف پول</p>
            <p className='inline-flex items-center gap-1.5 mt-1 font-IranYekanBold text-2xl sm:text-3xl'>
              {balance.toLocaleString()}
              <TomanIcon className='w-5 h-5' />
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className='flex-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm bg-white text-primary-600 hover:bg-white/90 rounded-xl transition-colors cursor-pointer shrink-0'>
          <PiPlusCircleLight className='w-4 h-4' />
          افزایش موجودی
        </button>
      </div>

      {isModalOpen && (
        <TopUpModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
