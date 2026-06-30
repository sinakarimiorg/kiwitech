import React from 'react'
import ServiceBox from './ServiceBox/ServiceBox'
import { IoMdCheckmark } from "react-icons/io";
import { RiCustomerService2Line } from "react-icons/ri";
import { SlSocialDropbox } from "react-icons/sl";
import { IoWalletOutline } from "react-icons/io5";


import './ServicesSection.css'

export default function ServicesSection() {
    return (
        <div className='services-section mt-20 py-16 md:py-24 xl:py-28'>
            <div className='container'>
                <div className='flex-center flex-wrap gap-x-7 custom-sc:gap-x-8 xl:gap-x-16 gap-y-7'>
                    <ServiceBox icon={<SlSocialDropbox className='service-box-icon' />} title={"بازگشت و تعویض کالا"} desc={'تا هفت روز به هر دلیل'}
                        gradiant={'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500'} transitionFrontClass={'top-0 bottom-0 right-0 left-0 group-hover:right-[100%]'}
                         transitionBackClass={'left-[100%] group-hover:left-0 '} />
                  
                    <ServiceBox icon={<RiCustomerService2Line className='service-box-icon' />} title={"مشاوره رایگان خرید"} desc={'برای تمامی خریدهای شما'}
                        gradiant={'bg-gradient-to-r from-gray-600 via-blue-500 to-cyan-400'} transitionFrontClass={'top-0 bottom-0 left-0 group-hover:left-[100%]'}
                         transitionBackClass={'right-[100%] group-hover:right-0 '} />
                   
                    <ServiceBox icon={<IoWalletOutline className='service-box-icon' />} title={"پرداخت با هر کارتی"} desc={'شتاب و غیر شتاب'}
                        gradiant={'bg-gradient-to-r from-lime-200 via-green-400 to-emerald-600'} transitionFrontClass={'bottom-0 right-0 left-0 group-hover:bottom-[100%]'}
                        transitionBackClass={'top-[100%] group-hover:top-0 '} />
                  
                    <ServiceBox icon={<IoMdCheckmark className='service-box-icon' />} title={"ضمانت اصل کالا"} desc={'تضمین اصالت و کیفیت کالا'}
                        gradiant={'bg-gradient-to-r from-purple-200 via-violet-400 to-indigo-600'} transitionFrontClass={'top-0 bottom-0 right-0 left-0 group-hover:top-[100%]'}
                         transitionBackClass={'bottom-[100%] group-hover:bottom-0'} />
                </div>
            </div>
        </div>
    )
}
