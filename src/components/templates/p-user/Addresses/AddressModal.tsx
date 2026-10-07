"use client"

import { useMemo, useState } from 'react'
import { getCitiesOfProvince, iranProvinces } from '@root/src/data/iranProvinces'
import { UserAddress } from '@root/src/types/userAddressType'
import PanelModal, { panelFieldClasses, panelPrimaryButton, panelSecondaryButton } from '../PanelModal/PanelModal'

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
  const [province, setProvince] = useState(initialData?.province ?? '')
  const [city, setCity] = useState(initialData?.city ?? '')
  const [fullAddress, setFullAddress] = useState(initialData?.fullAddress ?? '')
  const [error, setError] = useState('')

  const cityOptions = useMemo(() => getCitiesOfProvince(province), [province])

  const handleProvinceChange = (value: string) => {
    setProvince(value)
    setCity(prevCity => (getCitiesOfProvince(value).includes(prevCity) ? prevCity : ''))
  }

  const handleSubmit = () => {
    if (!title.trim() || !receiver.trim() || !phone.trim() || !province || !city || !fullAddress.trim()) {
      setError('لطفاً همه‌ی فیلدها را پر کنید.')
      return
    }
    onSave({
      title: title.trim(),
      receiver: receiver.trim(),
      phone: phone.trim(),
      province,
      city,
      fullAddress: fullAddress.trim(),
    })
  }

  return (
    <PanelModal
      title={initialData ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
      size='lg'
      busy={isSaving}
      onClose={onClose}
      footer={
        <div className='flex items-center gap-3'>
          <button onClick={handleSubmit} disabled={isSaving} className={panelPrimaryButton}>
            {isSaving ? 'در حال ذخیره...' : initialData ? 'ذخیره تغییرات' : 'افزودن آدرس'}
          </button>
          <button onClick={onClose} disabled={isSaving} className={panelSecondaryButton}>
            انصراف
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5 text-xs text-zinc-500">عنوان آدرس</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="مثال: خانه، محل کار"
            className={panelFieldClasses}
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs text-zinc-500">نام تحویل‌گیرنده</label>
          <input
            value={receiver}
            onChange={e => setReceiver(e.target.value)}
            placeholder="مثال: سینا کریمی"
            autoComplete="name"
            className={panelFieldClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1.5 text-xs text-zinc-500">شماره موبایل</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={`${panelFieldClasses} text-left`}
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs text-zinc-500">استان</label>
          <select
            value={province}
            onChange={e => handleProvinceChange(e.target.value)}
            className={`${panelFieldClasses} cursor-pointer`}
          >
            <option value="">انتخاب استان</option>
            {iranProvinces.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1.5 text-xs text-zinc-500">شهر</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            disabled={!province}
            className={`${panelFieldClasses} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">{province ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}</option>
            {cityOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1.5 text-xs text-zinc-500">آدرس کامل (خیابان، پلاک، واحد)</label>
          <textarea
            value={fullAddress}
            onChange={e => setFullAddress(e.target.value)}
            rows={3}
            placeholder="خیابان، کوچه، پلاک، واحد..."
            className={`${panelFieldClasses} resize-none`}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-danger">{error}</p>}
    </PanelModal>
  )
}
