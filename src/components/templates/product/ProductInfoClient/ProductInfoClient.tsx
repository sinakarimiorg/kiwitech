"use client"

import React, { useEffect, useState, useTransition } from 'react'
import Swal from 'sweetalert2'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Footer from '@root/src/components/modules/Footer/Footer'
import Header from '@root/src/components/modules/Header/Header'
import { AdminProduct } from '@root/src/types/adminProductType'
import { PublicComment } from '@root/src/types/commentType'
import CommentsSection from '../CommentsSection/CommentsSection'
import ProductGallery from '../ProductGallery/ProductGallery'
import ProductFeatureBox from '../ProductFeatureBox/ProductFeatureBox'
import ProductFeatureBoxLarge from '../ProductFeatureBoxLarge/ProductFeatureBoxLarge'
import TomanIcon from '@root/src/components/modules/Icons/TomanIcon'
import { toggleFavoriteAction } from '../../P-user/Favorites/action'
import { useAppDispatch, useAppSelector } from '@root/src/store/hooks'
import { addToCart } from '@root/src/store/reducers/cartSlice'
import { RiStarFill } from "react-icons/ri";
import { GoShareAndroid } from "react-icons/go";
import { LiaComments } from "react-icons/lia";
import { PiBellRingingLight, PiStorefront, PiWarningOctagonThin, PiPhoneCallLight } from "react-icons/pi";
import { TbHeartPlus } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { BsPatchCheck } from "react-icons/bs";
import { CiBoxes } from "react-icons/ci";

import styles from '@/styles/product.module.css'

const toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true,
})

const tabs = [
  { id: 'product__description-section', label: 'معرفی' },
  { id: 'product__features-section', label: 'مشخصات' },
  { id: 'product__comments-section', label: 'نظرات کاربران' },
]

function OfferBar({ discountPercent, rounded = 'rounded-t-xl' }: { discountPercent: number, rounded?: string }) {
  if (discountPercent <= 0) return null

  return (
    <div className={`flex items-center justify-between py-4 px-3 w-full text-text bg-linear-to-r from-lime-900 to-lime-800 border-b border-border-light ${rounded}`}>
      <span className='font-Morabba'>پیشـنهاد ویـژه</span>
      <span className='px-2.5 py-1 text-sm bg-white/15 rounded-lg'>{discountPercent}٪ تخفیف</span>
    </div>
  )
}

function PriceBlock({ product, discountPercent, className = '' }: { product: AdminProduct, discountPercent: number, className?: string }) {
  return (
    <div className={`flex items-center gap-x-2 lg:gap-x-4 pt-2 pl-2 ${className}`}>
      {discountPercent > 0 && (
        <div className='inline-flex justify-center items-end h-5 w-10 lg:w-11 text-center text-[10px] bg-linear-to-r from-primary-400 to-neon text-surface rounded-xl'>
          <span className='text-xs'>{discountPercent}</span>%
        </div>
      )}
      {product.exPrice && product.exPrice > product.price && (
        <span className={styles.cart__exPrice}>{product.exPrice.toLocaleString()}</span>
      )}
      <div className='inline-flex gap-1'>
        <span className='font-IranYekanBold text-lg lg:text-xl'>{product.price.toLocaleString()}</span>
        <span><TomanIcon /></span>
      </div>
    </div>
  )
}

function AddToCartButton({ inStock, onClick, className = '' }: { inStock: boolean, onClick: () => void, className?: string }) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={!inStock}
      className={`flex items-center justify-center w-full text-center font-IranYekanMedium ${className}
        ${inStock ? 'linear_btn cursor-pointer' : 'bg-gray-200 text-zinc-400 cursor-not-allowed rounded-lg'}`}
    >
      {inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
    </button>
  )
}

type ActionButtonsProps = {
  isFav: boolean
  isPending: boolean
  onToggleFavorite: () => void
  onShare: () => void
}

function ActionButtons({ isFav, isPending, onToggleFavorite, onShare }: ActionButtonsProps) {
  return (
    <div className='flex-center gap-x-4 sm:gap-x-5 mb-4'>
      <button type='button' onClick={onShare} aria-label='اشتراک گذاری کالا' className={styles.product__actionButton}>
        <GoShareAndroid className='w-5 h-5 text-primary-500' />
        <span className={`${styles.tooltiptext} hidden md:block`}>اشتراک گذاری کالا</span>
      </button>

      <a href='#product__comments-section' aria-label='نظرات کاربران' className={styles.product__actionButton}>
        <LiaComments className='w-5 h-5 text-primary-500' />
        <span className={`${styles.tooltiptext} hidden md:block`}>نظرات کاربران</span>
      </a>

      <button type='button' aria-label='اطلاع‌رسانی کیوی‌تک' className={styles.product__actionButton}>
        <PiBellRingingLight className='w-5 h-5 text-primary-500' />
        <span className={`${styles.tooltiptext} hidden md:block`}>اطلاع‌رسانی کیوی‌تک</span>
      </button>

      <button
        type='button'
        onClick={onToggleFavorite}
        disabled={isPending}
        aria-label={isFav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        aria-pressed={isFav}
        className={styles.product__actionButton}
      >
        <TbHeartPlus className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-primary-500'}`} />
        <span className={`${styles.tooltiptext} hidden md:block`}>
          {isFav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        </span>
      </button>
    </div>
  )
}

type ProductInfoClientProps = {
  product: AdminProduct
  comments: PublicComment[]
  ratingAverage: number
  ratingCount: number
  initialIsFavorite: boolean
}

export default function ProductInfoClient({ product, comments, ratingAverage, ratingCount, initialIsFavorite }: ProductInfoClientProps) {
  ////////// Handle NavBar visiblity
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true)

  const handleScroll = () => {
    const currentScrollPos = window.scrollY
    setVisible(currentScrollPos <= prevScrollPos)
    setPrevScrollPos(currentScrollPos)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const [activeSection, setActiveSection] = useState(tabs[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id) }),
      { rootMargin: '-30% 0px -60% 0px' }
    )
    tabs.forEach(tab => {
      const element = document.getElementById(tab.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  ////////// Favorites
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();

  const toggleFavorite = () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction(product._id);

      if (result.success) {
        setIsFav(result.isFavorite);
        toast.fire({ icon: 'success', title: result.isFavorite ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد' })
      } else {
        Swal.fire({ icon: 'warning', text: result.error })
      }
    });
  };

  ////////// Share
  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.fire({ icon: 'success', title: 'لینک محصول کپی شد' })
      }
    } catch {
      // کاربر منوی اشتراک را بست
    }
  }

  ////////// Product Info
  const images = [product.img, ...(product.images ?? [])].filter(Boolean)
  const mainImage = images[0] ?? '/images/logo/logo.png'

  const discountPercent =
    product.discount && product.discount > 0
      ? product.discount
      : product.exPrice && product.exPrice > product.price
        ? Math.round(((product.exPrice - product.price) / product.exPrice) * 100)
        : 0

  const colorList = product.colors
    ? product.colors.split(/[،,]/).map(c => c.trim()).filter(Boolean)
    : []

  const tagList = product.tags ?? []
  const inStock = product.stock > 0
  const hasExPrice = !!product.exPrice && product.exPrice > product.price

  const featureItems = [
    { name: 'دسته‌بندی', status: product.category },
    { name: 'زیرمجموعه', status: product.subCategory },
    { name: 'وضعیت موجودی', status: inStock ? `${product.stock.toLocaleString('fa-IR')} عدد موجود` : 'ناموجود' },
    colorList.length > 0 ? { name: 'رنگ‌های موجود', status: colorList.join('، ') } : null,
    tagList.length > 0 ? { name: 'برچسب‌ها', status: tagList.join('، ') } : null,
  ].filter(Boolean) as { name: string; status: string }[]

  ////////// cart
  const dispatch = useAppDispatch()
  const countInCart = useAppSelector(state => state.cart.items.find(item => item.id === product._id)?.count ?? 0)

  const handleAddToCart = () => {
    if (!inStock) return
    if (countInCart >= product.stock) {
      toast.fire({ icon: 'warning', title: 'به حداکثر موجودی این کالا رسیده‌اید' })
      return
    }
    dispatch(addToCart({
      id: product._id,
      linkName: product.linkName,
      title: product.name,
      img: mainImage,
      price: product.price,
      exPrice: product.exPrice,
      stock: product.stock,
    }))
    toast.fire({ icon: 'success', title: 'به سبد خرید اضافه شد' })
  }

  const stockLabel = inStock ? 'موجود در انبار کیوی‌تک (ارسال فوری)' : 'ناموجود در انبار'

  return (
    <div>
      <Header />
      <BreadCrumb
        links={[
          { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
          { id: 2, title: product.category || 'همه محصولات', to: '/products/1' },
          { id: 3, title: product.name, to: `/product-info/${product.linkName}` },
        ]} />

      <div className='container px-3 sm:px-0 pb-28 md:pb-0'>

        {/* Main section/ gallery / cart */}
        <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] gap-5 xl:gap-8'>

          <div className='min-w-0'>
            <div className='xl:hidden'>
              <OfferBar discountPercent={discountPercent} />
            </div>

            <div className={`p-4 sm:p-6 lg:p-7 bg-white border border-gray-300 ${discountPercent > 0 ? 'rounded-b-xl xl:rounded-xl' : 'rounded-xl'}`}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>

                <div className='min-w-0 order-2 md:order-0'>
                  <h1 className='font-MorabbaBold text-lg lg:text-xl tracking-wide leading-8'>
                    {product.name}
                  </h1>

                  <div className='inline-flex items-center gap-2 pt-4 pb-2 border-b border-gray-300'>
                    <p className='flex gap-1'>
                      <span><RiStarFill className='h-5 w-5 text-amber-500' /></span>
                      <span className='text-text-muted'>{ratingAverage.toFixed(1)}</span>
                    </p>
                    <a href='#product__comments-section' className='text-text-muted hover:text-primary-500 text-xs cursor-pointer'>
                      (از {ratingCount.toLocaleString('fa-IR')} نظر)
                    </a>
                  </div>

                  {colorList.length > 0 && (
                    <div className='mt-5 pb-4 border-b border-gray-300'>
                      <p className='pb-3 text-text-muted'>رنگ‌های موجود:</p>
                      <div className='flex flex-wrap items-center gap-2'>
                        {colorList.map(color => (
                          <span key={color} className='px-3 py-1.5 text-xs border border-gray-300 rounded-full text-zinc-600'>{color}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='mt-6'>
                    <h3 className='font-IranYekanBold pb-4'>ویژگی‌ها</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 2xl:grid-cols-3 gap-3'>
                      {featureItems.map(item => (
                        <ProductFeatureBox key={item.name} name={item.name} status={item.status} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className='min-w-0 order-1 md:order-0'>
                  <ActionButtons
                    isFav={isFav}
                    isPending={isPending}
                    onToggleFavorite={toggleFavorite}
                    onShare={handleShare}
                  />
                  <ProductGallery images={images} name={product.name} />
                </div>
              </div>
            </div>
          </div>

          <aside className='hidden md:block min-w-0'>
            <div className='bg-white shadow-xl rounded-xl overflow-hidden'>
              <div className='hidden xl:block'>
                <OfferBar discountPercent={discountPercent} />
              </div>

              <div className='p-4 xl:p-6'>
                <div className='hidden xl:block'>
                  <div className='flex gap-1.5 mb-2.5 py-4 px-3 glass-card rounded-md'>
                    <div>
                      <div className='flex items-center gap-2 text-sm'>
                        <PiStorefront className='w-5 h-5' />
                        <span className='font-IranYekanMedium text-lg'>کیوی‌تک</span>
                      </div>
                      <div className='flex gap-2 text-sm mt-2'>
                        <CiBoxes className='w-4 h-4' />
                        <span className='text-xs tracking-tight text-text-muted'>{stockLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-1.5 mb-2.5 py-4 px-3 glass-card rounded-md'>
                    <IoSettingsOutline className='w-4 h-4' />
                    <div className='flex gap-2'>
                      <span className='text-sm'>دسته‌بندی :</span>
                      <span className='text-sm font-IranYekanBold text-text-muted'>{product.subCategory}</span>
                    </div>
                  </div>

                  <div className='flex gap-1.5 py-4 px-3 glass-card rounded-md'>
                    <BsPatchCheck className='w-4 h-4' />
                    <div className='flex gap-2'>
                      <span className='text-sm'>سرویس کیوی‌تک :</span>
                      <span className='text-sm font-IranYekanBold text-text-muted'>۷ روز تضمین بازگشت کالا</span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col md:flex-row xl:flex-col md:items-center xl:items-stretch gap-4 xl:gap-5 xl:mt-5'>
                  <PriceBlock product={product} discountPercent={discountPercent} className='md:flex-1 justify-start xl:justify-end xl:px-4' />
                  <AddToCartButton inStock={inStock} onClick={handleAddToCart} className='h-11 md:w-64 xl:w-full xl:h-12 xl:text-lg' />
                </div>
              </div>
            </div>

            <div className='flex md:flex-row xl:flex-col md:items-center xl:items-stretch justify-around gap-4 mt-4 py-5 px-4 bg-white shadow-xl rounded-xl'>
              <div className='flex items-center gap-1.5 pb-0 xl:pb-2 xl:border-b border-dotted border-gray-300 cursor-pointer'>
                <PiWarningOctagonThin className='w-5 h-5 text-amber-500' />
                <span className='text-sm text-text-muted'>گزارش نادرستی مشخصات</span>
              </div>

              <div className='flex items-center gap-4 xl:pt-1 cursor-pointer'>
                <span className='inline-block p-1 text-text-muted border border-zinc-600 rounded-full'><PiPhoneCallLight className='w-6 h-6 text-text-muted' /></span>
                <div>
                  <p className='text-sm text-text-muted tracking-tight'>ارتباط با فروش</p>
                  <p className='font-IranYekanMedium text-sm'>تماس با کـارشناسان</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ───────── Down section: Tabs/ comments/ features ───────── */}
        <div className='mt-12 lg:mt-20'>

          <div className={`sticky z-10 top-0 ${visible ? 'md:top-41' : 'md:top-24'}`}>
            <ul className='flex gap-5 sm:gap-8 px-3 sm:px-4 overflow-x-auto rounded-t-md bg-surface-3 text-text scrollbar-none [&::-webkit-scrollbar]:hidden'>
              {tabs.map(tab => {
                const isActive = activeSection === tab.id
                return (
                  <li key={tab.id} className={`${styles.productInfo__menuTitle} shrink-0`}>
                    <a
                      href={`#${tab.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`whitespace-nowrap transition-colors ${isActive ? 'text-neon' : 'text-text-muted hover:text-text'}`}
                    >
                      {tab.label}
                    </a>
                    {isActive && <div className={styles.productInfo__underlineBorder}></div>}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className='flex flex-col lg:flex-row gap-x-8 xl:gap-x-16 pt-8'>

            <div className='min-w-0 lg:w-8/12 xl:w-9/12'>
              <div id='product__description-section' className='scroll-mt-20 md:scroll-mt-64 px-1 sm:px-2.5 mb-7'>
                <h2 className={styles.productInfo__title}>معرفی</h2>
                <p className='text-sm lg:text-base text-text-muted leading-8 lg:leading-9 wrap-break-word'>
                  {product.description || 'توضیحاتی برای این محصول ثبت نشده است.'}
                </p>
              </div>

              <div className={styles.dividerBorder}></div>

              <div id='product__features-section' className='scroll-mt-20 md:scroll-mt-64'>
                <h2 className={styles.productInfo__title}>مشـخصات فـنی</h2>
                <div>
                  {featureItems.map(item => (
                    <ProductFeatureBoxLarge key={item.name} name={item.name} status={item.status} />
                  ))}
                </div>
              </div>

              <div className={styles.dividerBorder}></div>

              <div id='product__comments-section' className='scroll-mt-20 md:scroll-mt-64'>
                <CommentsSection
                  productId={product._id}
                  linkName={product.linkName}
                  productName={product.name}
                  comments={comments}
                  ratingAverage={ratingAverage}
                  ratingCount={ratingCount}
                />
              </div>
            </div>

            <aside className={`hidden lg:block lg:sticky ${visible ? 'top-60' : 'top-44'} h-fit lg:w-4/12 xl:w-3/12 bg-white shadow-xl rounded-xl overflow-hidden`}>
              <OfferBar discountPercent={discountPercent} />

              <div className='flex-center gap-4 lg:gap-6 px-4 lg:px-6 pt-5 pb-3'>
                <img className='w-14 h-14 shrink-0 object-contain' src={mainImage} alt={product.name} />
                <div className='min-w-0'>
                  <h3 className='font-IranYekanMedium text-sm lg:text-base line-clamp-2'>{product.name}</h3>
                  {colorList.length > 0 && (
                    <span className='block pt-2 text-text-muted text-xs lg:text-sm'>{colorList[0]}</span>
                  )}
                </div>
              </div>

              <div className='pb-6 px-5'>
                <div className='py-2 lg:py-3 px-1 lg:px-3 border-y border-dotted border-gray-300'>
                  <div className='flex items-center gap-1.5 mb-2.5 py-1'>
                    <CiBoxes className='w-5 h-5 shrink-0' />
                    <span className='font-IranYekanMedium text-xs lg:text-sm tracking-tight'>{stockLabel}</span>
                  </div>
                  <div className='flex items-center gap-1.5 py-1'>
                    <BsPatchCheck className='w-4 h-4 shrink-0' />
                    <span className='font-IranYekanMedium text-xs lg:text-sm'>۷ روز تضمین بازگشت کالا</span>
                  </div>
                </div>

                <div className='my-3 lg:my-5 px-2 lg:px-4'>
                  <PriceBlock product={product} discountPercent={discountPercent} className='justify-end' />
                </div>

                <AddToCartButton inStock={inStock} onClick={handleAddToCart} className='h-11 lg:h-12 lg:text-lg' />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ───────── Mobile Fixed Cart ───────── */}
      <div className='md:hidden fixed bottom-0 inset-x-0 z-9 bg-white border-t border-gray-100 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex flex-col min-w-0'>
            {hasExPrice && (
              <span className='flex items-center gap-2'>
                <span className={styles.cart__exPrice}>{product.exPrice!.toLocaleString()}</span>
                {discountPercent > 0 && (
                  <span className='px-1.5 py-0.5 text-[10px] text-white bg-primary-600 rounded-md'>{discountPercent}٪</span>
                )}
              </span>
            )}
            <span className='inline-flex items-center gap-1 font-IranYekanBold text-lg'>
              {product.price.toLocaleString()}
              <TomanIcon />
            </span>
          </div>

          <AddToCartButton inStock={inStock} onClick={handleAddToCart} className='h-11 w-44! sm:w-56! shrink-0' />
        </div>
      </div>

      <Footer marginClasses={'mt-16 md:mt-32'} />
    </div>
  )
}
