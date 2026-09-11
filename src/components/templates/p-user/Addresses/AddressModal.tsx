import { UserAddress } from '@root/src/types/userAddressType'
import { useState } from 'react'
import { PiXBold } from 'react-icons/pi'

type AddressModalProps = {
  initialData: UserAddress | null
  onClose: () => void
  onSave: (data: Omit<UserAddress, "_id" | "isDefault">) => void
  isSaving?: boolean
}

export default function AddressModal({ initialData, onClose, onSave, isSaving }: AddressModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [receiver, setReceiver] = useState(initialData?.receiver ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [fullAddress, setFullAddress] = useState(initialData?.fullAddress ?? '')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || !receiver.trim() || !phone.trim() || !fullAddress.trim()) {
      setError('لطفاً همه‌ی فیلدها را پر کنید.')
      return
    }
    onSave({ title: title.trim(), receiver: receiver.trim(), phone: phone.trim(), fullAddress: fullAddress.trim() })
  }

  return (
    <div className="fixed inset-0 flex-center bg-black/40 z-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 sm:p-6">

        <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
          <h2 className="font-IranYekanBold text-base sm:text-lg text-zinc-800">
            {initialData ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
          </h2>
          <button onClick={onClose} className="flex-center w-8 h-8 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <PiXBold className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs text-zinc-500">عنوان آدرس</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: خانه، محل کار"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs text-zinc-500">نام تحویل‌گیرنده</label>
            <input
              value={receiver}
              onChange={e => setReceiver(e.target.value)}
              placeholder="مثال: سینا کریمی"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1.5 text-xs text-zinc-500">شماره موبایل</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
              className="w-full px-3.5 py-2.5 text-sm text-left bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1.5 text-xs text-zinc-500">آدرس کامل</label>
            <textarea
              value={fullAddress}
              onChange={e => setFullAddress(e.target.value)}
              rows={3}
              placeholder="استان، شهر، خیابان، پلاک، واحد..."
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors resize-none"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-danger">{error}</p>}

        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 flex-center h-11 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'در حال ذخیره...' : initialData ? 'ذخیره تغییرات' : 'افزودن آدرس'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex-center h-11 text-sm text-zinc-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  )
}
