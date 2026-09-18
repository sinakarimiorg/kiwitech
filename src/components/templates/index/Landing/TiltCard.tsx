import Tilt from 'react-parallax-tilt'

export default function TiltCard() {
    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.25}
            glareColor="#D7FF5C"
            glarePosition="all"
            tiltMaxAngleX={12}
            tiltMaxAngleY={12}
            scale={1.03}
            transitionSpeed={1500}
            className='w-full cursor-pointer'
        >
            <div className='relative glass-neon-card rounded-3xl p-6 sm:p-8'>
                <span className='absolute -top-3 -right-3 px-3 py-1 text-xs font-DanaDemiBold bg-neon text-surface rounded-full shadow-lg animate-glow-pulse'>
                    ٪۳۳ تخفیف
                </span>
                <img
                    src='/images/products/airpods.png'
                    alt='هدفون بی‌سیم کیوی‌تک'
                    className='w-full h-56 sm:h-64 object-contain drop-shadow-[0_25px_35px_rgba(159,190,35,0.35)]'
                />
                <div className='mt-5 text-center'>
                    <p className='text-zinc-700 text-sm sm:text-base'>هندزفری بلوتوثی کربی CR-T107</p>
                    <p className='mt-2 font-IranYekanBold text-primary-600 text-lg sm:text-xl'>۵۶۵,۰۰۰ تومان</p>
                </div>
            </div>
        </Tilt>
    )
}
