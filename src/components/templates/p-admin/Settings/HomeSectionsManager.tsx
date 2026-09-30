"use client"

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import {
    PiArrowUpLight,
    PiArrowDownLight,
    PiCaretDownLight,
    PiFloppyDiskLight,
    PiArrowCounterClockwiseLight,
    PiArrowSquareOutLight,
    PiHouseLight,
} from 'react-icons/pi'
import { defaultHomeSections, homeSectionMeta } from '@root/src/types/siteSettingsType'
import type { HomeSectionConfig, HomeSectionKey } from '@root/src/types/siteSettingsType'
import { saveHomeSectionsAction } from './actions'

type HomeSectionsManagerProps = {
    initialSections: HomeSectionConfig[]
}

const inputClasses =
    'w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition-colors'


export default function HomeSectionsManager({ initialSections }: HomeSectionsManagerProps) {
    const [sections, setSections] = useState<HomeSectionConfig[]>(initialSections)
    const [baseline, setBaseline] = useState(JSON.stringify(initialSections))
    const [openKey, setOpenKey] = useState<HomeSectionKey | null>(null)
    const [isPending, startTransition] = useTransition()

    const isDirty = JSON.stringify(sections) !== baseline
    const enabledCount = sections.filter(section => section.enabled).length

    const updateSection = (key: HomeSectionKey, patch: Partial<HomeSectionConfig>) => {
        setSections(prev => prev.map(section => (section.key === key ? { ...section, ...patch } : section)))
    }

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const target = direction === 'up' ? index - 1 : index + 1
        if (target < 0 || target >= sections.length) return

        setSections(prev => {
            const next = [...prev]
                ;[next[index], next[target]] = [next[target], next[index]]
            return next.map((section, i) => ({ ...section, order: i + 1 }))
        })
    }

    const handleSave = () => {
        startTransition(async () => {
            const result = await saveHomeSectionsAction(sections)

            if (result.success) {
                setSections(result.sections)
                setBaseline(JSON.stringify(result.sections))
                Swal.fire({
                    icon: 'success',
                    title: 'ذخیره شد',
                    text: 'تغییرات در صفحه اصلی اعمال شد',
                    timer: 1600,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({ icon: 'error', title: 'خطا', text: result.error })
            }
        })
    }

    const handleReset = async () => {
        const result = await Swal.fire({
            title: 'بازگشت به پیش‌فرض',
            text: 'ترتیب، عنوان‌ها و وضعیت همه‌ی بخش‌ها به حالت اولیه برمی‌گردد. (تا زمانی که ذخیره نکنید اعمال نمی‌شود)',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، برگردان',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#EF4444',
        })
        if (result.isConfirmed) setSections(defaultHomeSections)
    }

    return (
        <div className='p-5 sm:p-6 flex flex-col gap-6'>

            {/* Header */}
            <div className='flex items-start justify-between gap-4 flex-wrap'>
                <div>
                    <h1 className='flex items-center gap-2 font-IranYekanBold text-xl sm:text-2xl text-zinc-800'>
                        <PiHouseLight className='w-6 h-6 text-primary-500' />
                        تنظیمات صفحه اصلی
                    </h1>
                    <p className='mt-1.5 text-sm text-zinc-400 leading-7'>
                        بخش‌های صفحه اصلی را فعال یا غیرفعال کنید، ترتیبشان را عوض کنید و عنوان و تعداد نمایش هر بخش را ویرایش کنید.
                    </p>
                </div>

                <div className='flex items-center gap-3'>
                    <span className='px-3 py-1.5 text-xs text-primary-700 bg-primary-50 rounded-lg'>
                        {enabledCount.toLocaleString('fa-IR')} بخش فعال از {sections.length.toLocaleString('fa-IR')}
                    </span>
                    <button
                        type='button'
                        onClick={handleReset}
                        className='flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm text-zinc-500 hover:text-zinc-700 border border-gray-200 rounded-lg transition-colors cursor-pointer'
                    >
                        <PiArrowCounterClockwiseLight className='w-4 h-4' />
                        پیش‌فرض
                    </button>
                </div>
            </div>

            {/* Sections */}
            <div className='flex flex-col gap-3'>
                {sections.map((section, index) => {
                    const meta = homeSectionMeta[section.key]
                    const isOpen = openKey === section.key
                    const isEditable = meta.hasTitle || meta.hasSubtitle || meta.hasLimit

                    return (
                        <div
                            key={section.key}
                            className={`rounded-2xl border shadow-sm transition-colors
                                ${section.enabled ? 'bg-white border-gray-100' : 'bg-gray-50/70 border-dashed border-gray-200'}`}
                        >
                            <div className='flex items-center gap-3 px-4 sm:px-5 py-4'>

                                {/* ترتیب */}
                                <div className='flex flex-col shrink-0'>
                                    <button
                                        type='button'
                                        onClick={() => moveSection(index, 'up')}
                                        disabled={index === 0}
                                        aria-label='انتقال به بالا'
                                        className='flex-center w-7 h-6 text-zinc-400 hover:text-primary-600 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer disabled:cursor-not-allowed'
                                    >
                                        <PiArrowUpLight className='w-4 h-4' />
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => moveSection(index, 'down')}
                                        disabled={index === sections.length - 1}
                                        aria-label='انتقال به پایین'
                                        className='flex-center w-7 h-6 text-zinc-400 hover:text-primary-600 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer disabled:cursor-not-allowed'
                                    >
                                        <PiArrowDownLight className='w-4 h-4' />
                                    </button>
                                </div>

                                <span className='flex-center w-8 h-8 shrink-0 text-xs font-IranYekanBold text-primary-600 bg-primary-50 rounded-lg'>
                                    {(index + 1).toLocaleString('fa-IR')}
                                </span>

                                {/* عنوان بخش */}
                                <button
                                    type='button'
                                    onClick={() => isEditable && setOpenKey(isOpen ? null : section.key)}
                                    className={`flex-1 min-w-0 text-right ${isEditable ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    <p className={`font-IranYekanBold text-sm sm:text-base ${section.enabled ? 'text-zinc-800' : 'text-zinc-400'}`}>
                                        {meta.label}
                                    </p>
                                    <p className='mt-0.5 text-xs text-zinc-400 line-clamp-1'>{meta.description}</p>
                                </button>

                                <span className={`hidden sm:inline-block px-2.5 py-1 text-xs rounded-lg
                                    ${section.enabled ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-zinc-400'}`}>
                                    {section.enabled ? 'فعال' : 'غیرفعال'}
                                </span>

                                {/* سوییچ فعال/غیرفعال */}
                                <button
                                    type='button'
                                    role='switch'
                                    aria-checked={section.enabled}
                                    aria-label={`فعال یا غیرفعال کردن ${meta.label}`}
                                    onClick={() => updateSection(section.key, { enabled: !section.enabled })}
                                    className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer shrink-0
                                        ${section.enabled ? 'bg-primary-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all
                                        ${section.enabled ? 'right-0.5' : 'right-4.5'}`} />
                                </button>

                                {isEditable
                                    ? (
                                        <button
                                            type='button'
                                            onClick={() => setOpenKey(isOpen ? null : section.key)}
                                            aria-label='ویرایش جزئیات'
                                            aria-expanded={isOpen}
                                            className='flex-center w-8 h-8 shrink-0 text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
                                        >
                                            <PiCaretDownLight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    )
                                    : <span className='w-8 shrink-0' />
                                }
                            </div>

                            {/* جزئیات قابل ویرایش */}
                            {isOpen &&
                                <div className='px-4 sm:px-5 pb-5 pt-4 border-t border-gray-100'>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        {meta.hasTitle &&
                                            <div className={meta.hasSubtitle ? '' : 'sm:col-span-2'}>
                                                <label className='block mb-1.5 text-xs text-zinc-500'>عنوان بخش</label>
                                                <input
                                                    value={section.title}
                                                    onChange={event => updateSection(section.key, { title: event.target.value })}
                                                    maxLength={60}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        }

                                        {meta.hasSubtitle &&
                                            <div>
                                                <label className='block mb-1.5 text-xs text-zinc-500'>توضیح زیر عنوان (اختیاری)</label>
                                                <input
                                                    value={section.subtitle}
                                                    onChange={event => updateSection(section.key, { subtitle: event.target.value })}
                                                    maxLength={120}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        }

                                        {meta.hasLimit &&
                                            <div>
                                                <label className='block mb-1.5 text-xs text-zinc-500'>
                                                    تعداد نمایش ({meta.minLimit.toLocaleString('fa-IR')} تا {meta.maxLimit.toLocaleString('fa-IR')})
                                                </label>
                                                <input
                                                    type='number'
                                                    min={meta.minLimit}
                                                    max={meta.maxLimit}
                                                    value={section.limit || ''}
                                                    onChange={event => updateSection(section.key, { limit: Number(event.target.value) })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        }
                                    </div>

                                    <div className='flex items-center justify-between flex-wrap gap-2 mt-4 text-xs text-zinc-400'>
                                        <span>منبع داده: {meta.source}</span>
                                        {meta.manageHref &&
                                            <Link href={meta.manageHref} className='flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors'>
                                                مدیریت داده‌ها
                                                <PiArrowSquareOutLight className='w-3.5 h-3.5' />
                                            </Link>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    )
                })}
            </div>

            {/* نوار ذخیره */}
            {isDirty &&
                <div className='sticky bottom-4 z-10 flex items-center justify-between gap-3 px-5 py-3 text-text bg-dark-secondary border border-border rounded-2xl shadow-2xl'>
                    <span className='text-sm'>تغییرات ذخیره‌نشده دارید</span>
                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={() => setSections(JSON.parse(baseline))}
                            disabled={isPending}
                            className='px-4 py-2 text-sm text-text-muted hover:text-text border border-border rounded-lg transition-colors cursor-pointer disabled:opacity-60'
                        >
                            لغو تغییرات
                        </button>
                        <button
                            type='button'
                            onClick={handleSave}
                            disabled={isPending}
                            className='flex items-center gap-1.5 px-5 py-2 text-sm text-text linear_btn disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            <PiFloppyDiskLight className='w-4 h-4' />
                            {isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}
