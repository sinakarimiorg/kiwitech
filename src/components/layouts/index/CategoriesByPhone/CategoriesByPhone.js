import React from 'react'

export default function categoriesByPhone() {
    return (
        <div>
            <div className='container'>
                <h4 className='mb-7 sm:mb-10 font-MorabbaBold text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide text-center'>دسته بندی بر اساس مدل گوشی</h4>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 w-full overflow-hidden child:cursor-pointer child:rounded-2xl'>
                    <img className='2xl:w-86.5 2xl:h-72 hover:scale-95 transition-all' src='/images/categoriesByPhone/apple.jpg'/>
                    <img className='2xl:w-86.5 2xl:h-72 hover:scale-95 transition-all' src='/images/categoriesByPhone/samsung.jpg'/>
                    <img className='2xl:w-86.5 2xl:h-72 hover:scale-95 transition-all' src='/images/categoriesByPhone/xiaomi.jpg'/>
                    <img className='2xl:w-86.5 2xl:h-72 hover:scale-95 transition-all' src='/images/categoriesByPhone/huawei.jpg'/>
                </div>
            </div>
        </div>
    )
}
