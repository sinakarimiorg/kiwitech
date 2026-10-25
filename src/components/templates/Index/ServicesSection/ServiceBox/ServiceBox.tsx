import React from 'react'

type serviceBoxProps = {
  icon: React.ReactNode,
  title: string,
  desc: string,
  gradiant: string,
  transitionFrontClass: string,
  transitionBackClass: string
}

export default function ServiceBox({ icon, title, desc, gradiant, transitionFrontClass, transitionBackClass }: serviceBoxProps) {
  return (
    <div className='service-box group'>

      {/* service box front content */}
      <div className={`absolute ${transitionFrontClass} flex-center flex-col w-full h-full border border-white transition-all duration-500`}>
        <span className='my-4 lg:my-6 border-2 border-dotted border-zinc-500 p-3 lg:p-4'>{icon}</span>
        <h2 className='font-DanaMedium md:text-lg xl:text-xl md:leading-9 tracking-tight'>{title}</h2>
        <p className='text-xs md:text-sm text-zinc-500 tracking-tighter'>{desc}</p>
      </div>

      {/* service box back content */}
      <div className={`absolute ${transitionBackClass} w-full h-full px-7 text-center content-center text-white transition-all duration-500 ${gradiant}`}>
        <p className='text-xs md:text-sm xl:text-base line-clamp-5 xl:line-clamp-4'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم
          از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله..
        </p>
        <button className='mt-2 xl:mt-3 2xl:mt-5 px-2 xl:px-4 py-1 xl:py-2 xl:font-DanaMedium text-xs xl:text-sm tracking-tight bg-black/70 hover:bg-white/80 hover:text-zinc-700 rounded-2xl'>مطالعه بیشتر</button>
      </div>
    </div>
  )
}
