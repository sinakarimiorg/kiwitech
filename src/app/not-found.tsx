
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import Header from "../components/modules/Header/Header";
import Footer from "../components/modules/Footer/Footer";


const page = () => {
  return (
    <>
      <Header />
      <div className='sm:pt-40'>
        <div className='relative my-5 w-full'>
          <img className='w-full h-full' src='/images/404.png' />

          {/* Infos */}
          <div className="absolute left-1/6 md:top-10 m-auto w-1/4">
            <div className="flex-center flex-col ">
              <div className="flex-center space-x-1 font-bold font-gotham text-[10rem] leading-40">
                <h1 className="text-secondary">4</h1>
                <h1 className="text-primary-500 ">0</h1>
                <h1 className="text-secondary">4</h1>
              </div>
              <span className="font-Morabba text-secondary text-5xl">صفحه مورد نظر پیدا نشد!</span>
              <p className="mt-14 px-8 text-xl text-gray-500/60 text-center">
                متاسفانه صفحه ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
              </p>
              {/* Button  */}
              <div className="flex items-center justify-between w-2/5 h-10 mt-6 px-3 text-secondary bg-primary-500 cursor-pointer hover:shadow-2xl hover:bg-primary/70 rounded-xl">
                <Link href="/"
                  className='text-lg text-text tracking-tighter'>
                  بازگشت به خانـه
                </Link>
                <span className="h-full flex-center bg-secondary text-white rounded-lg"><FaArrowLeftLong className="px-1.5 text-4xl" /></span>
              </div>
            </div>
          </div>

          {/* Logo */}
          <img className="absolute left-20 md:bottom-10 w-50" src='/images/logo/logo2.png' />

        </div>
      </div>
      <Footer marginClasses={''} />
    </>
  );
};

export default page;
