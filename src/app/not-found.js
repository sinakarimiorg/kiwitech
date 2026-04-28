import Link from "next/link";

const page = () => {
  return (
    <div className='sm:pt-40'>
      <div className='relative my-10 md:my-16 w-full'>
        <img className='w-full h-full' src='/images/404.png' />
        <Link href="/" className='absolute flex-center right-0 left-0 bottom-8 md:bottom-16 w-20 md:w-36 custom-sc:w-52 xl:w-60 h-5 md:h-8 custom-sc:h-11 xl:h-14 m-auto opacity-10 cursor-pointer hover:shadow-2xl hover:shadow-amber-400 hover:opacity-90'>

        </Link>
      </div>
      <div className="h-screen">

      </div>
    </div>
  );
};

export default page;
