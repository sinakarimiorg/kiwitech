


const Header = () => {

    return (
        <header className='flex items-center justify-between mb-8 text-custom-third'>
            <h1 className='font-DanaDemiBold text-xl'>داشبورد</h1>
            <div className='flex-center gap-x-1 py-1.5 px-4 bg-white font-DanaMedium text-sm rounded-md'>
                <span>امروز: </span>
                <span className='text-[#7460ee] text-sm'>30 تیر</span>
            </div>
        </header>
    )
}

export default Header;