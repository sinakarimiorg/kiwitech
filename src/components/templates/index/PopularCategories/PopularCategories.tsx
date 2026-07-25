import React from 'react'
import SectionHeader from '@root/src/components/modules/sectionHeader/sectionHeader'
import PopularCategoryBox from '../PopularCategoryBox/PopularCategoryBox'

export default function PopularCategories() {
    return (
        <div>
            <div className='container'>
                <SectionHeader title={'دسته بندی های محبوب'} desc={'بهترین ها را از ما بخواهید'} btnTitle={'مشاهده همه'} />
                <div className='w-full flex-center flex-wrap m-auto gap-10 md:gap-16 2xl:gap-20'>
                    <PopularCategoryBox src={'/images/categories/phone-category.png'} title={'گوشی موبایل'} />
                    <PopularCategoryBox src={'/images/categories/cable-category.png'} title={'کابل و تبدیلات'} />
                    <PopularCategoryBox src={'/images/categories/hard-category.png'} title={'ذخیره سازی'} />
                    <PopularCategoryBox src={'/images/categories/watch-category.png'} title={'ساعت هوشمند'} />
                    <PopularCategoryBox src={'/images/categories/holder-category.png'} title={'هولدر موبایل'} />
                    <PopularCategoryBox src={'/images/categories/computer-category.png'} title={'جانبی کامپیوتر'} />
                    <PopularCategoryBox src={'/images/categories/other-category.png'} title={'سایر'} />
                </div>
            </div>
        </div>
    )
}
