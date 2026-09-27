import Header from '@root/src/components/modules/Header/Header'
import Footer from '@root/src/components/modules/Footer/Footer'
import BreadCrumb from '@root/src/components/modules/BreadCrumb/BreadCrumb'
import Link from 'next/link'
import {
    PiScalesLight,
    PiInfoLight,
    PiCaretDownLight,
    PiPhoneCallLight,
    PiEnvelopeSimpleLight,
    PiClockLight,
    PiMapPinLight,
} from 'react-icons/pi'

export const metadata = {
    title: 'قوانین و مقررات | کیوی‌تک',
    description: 'قوانین و مقررات استفاده از فروشگاه کیوی‌تک: ثبت سفارش، پرداخت، ارسال، بازگشت کالا، حریم خصوصی و ...',
}

const LAST_UPDATED = '۱۴۰۵/۰۶/۲۹'

const store = {
    phone: '۰۲۱-۱۱۱۱۰۰۰',
    phoneHref: 'tel:02111111000',
    email: 'info@kiwitech.ir',
    hours: 'شنبه تا پنجشنبه، ۸ صبح تا ۱۸ عصر',
    address: 'ارومیه',
}

const policy = {
    returnDays: 7,
    freeShippingFrom: 1000000,
    shippingCost: 45000,
    codFee: 25000,
    refundDays: '۳ تا ۷ روز کاری',
    bankRefundHours: 72,
}

const money = (value: number) => `${value.toLocaleString('fa-IR')} تومان`

/* ───────── محتوا ───────── */
type Block =
    | { type: 'p'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'note'; text: string }
    | { type: 'contact' }

type Section = { id: string; title: string; blocks: Block[] }

const sections: Section[] = [
    {
        id: 'intro',
        title: 'مقدمه و پذیرش قوانین',
        blocks: [
            {
                type: 'p',
                text: 'فروشگاه اینترنتی کیوی‌تک (در ادامه «کیوی‌تک») عرضه‌کننده‌ی لوازم جانبی موبایل و کامپیوتر است. ورود به وب‌سایت، ثبت‌نام و خرید از کیوی‌تک به معنی مطالعه و پذیرش کامل قوانین زیر است. اگر با هر بخش از این قوانین موافق نیستید، لطفاً از خدمات سایت استفاده نکنید.',
            },
        ],
    },
    {
        id: 'definitions',
        title: 'تعاریف',
        blocks: [
            {
                type: 'list',
                items: [
                    '«کاربر»: هر شخصی که از وب‌سایت بازدید می‌کند یا از آن خرید می‌کند.',
                    '«سفارش»: درخواست خریدی که کاربر از طریق وب‌سایت ثبت می‌کند.',
                    '«کالا»: هر محصولی که در وب‌سایت عرضه می‌شود.',
                    '«حساب کاربری»: حساب شخصی کاربر که با شماره موبایل ساخته می‌شود.',
                ],
            },
        ],
    },
    {
        id: 'account',
        title: 'حساب کاربری',
        blocks: [
            {
                type: 'list',
                items: [
                    'ثبت‌نام با شماره موبایل معتبر و کد تایید انجام می‌شود.',
                    'کاربر مسئول صحت اطلاعات واردشده (نام، آدرس و شماره تماس) است.',
                    'حفظ دسترسی به شماره موبایل و فعالیت‌هایی که با حساب کاربری انجام می‌شود بر عهده‌ی کاربر است.',
                    'کیوی‌تک می‌تواند حساب‌هایی را که اطلاعات نادرست ثبت کرده‌اند یا از سایت سوءاستفاده می‌کنند مسدود کند.',
                    'استفاده‌ی افراد زیر ۱۸ سال از سایت باید با نظارت والدین یا سرپرست قانونی باشد.',
                ],
            },
        ],
    },
    {
        id: 'pricing',
        title: 'قیمت و موجودی کالا',
        blocks: [
            {
                type: 'list',
                items: [
                    'قیمت‌ها به تومان نمایش داده می‌شوند و قیمت نهایی، قیمتِ زمان ثبت سفارش است.',
                    'قیمت و موجودی کالاها ممکن است بدون اطلاع قبلی تغییر کند.',
                    'ثبت سفارش تا زمان بررسی و تایید موجودی به معنی قطعی شدن فروش نیست.',
                    'در صورت خطای آشکار در درج قیمت یا موجودی، کیوی‌تک می‌تواند سفارش را لغو کند و وجه پرداختی را به‌طور کامل بازگرداند.',
                    'تخفیف‌ها و کدهای تخفیف مشمول شرایط خود (تاریخ انقضا، حداقل مبلغ خرید و سقف تعداد استفاده) هستند.',
                ],
            },
        ],
    },
    {
        id: 'payment',
        title: 'ثبت سفارش و پرداخت',
        blocks: [
            {
                type: 'list',
                items: [
                    'پرداخت آنلاین از طریق درگاه بانکی و با کارت‌های عضو شتاب انجام می‌شود.',
                    `پرداخت در محل (برای سفارش‌های واجد شرایط) با هزینه‌ی اضافه‌ی ${money(policy.codFee)} انجام می‌شود.`,
                    'در صورت فعال بودن، می‌توانید از موجودی کیف پول خود برای پرداخت استفاده کنید.',
                    'اطلاعات کارت بانکی فقط در صفحه‌ی درگاه بانک وارد می‌شود و نزد کیوی‌تک ذخیره نمی‌شود.',
                    `اگر مبلغی از حساب شما کم شد ولی سفارش ثبت نشد، طبق روال بانک‌ها حداکثر تا ${policy.bankRefundHours.toLocaleString('fa-IR')} ساعت کاری به حساب شما برمی‌گردد.`,
                    'سفارشی که پرداخت آن نهایی نشده باشد پردازش و ارسال نمی‌شود.',
                ],
            },
        ],
    },
    {
        id: 'shipping',
        title: 'ارسال و تحویل',
        blocks: [
            {
                type: 'list',
                items: [
                    'ارسال به سراسر کشور انجام می‌شود و در تهران امکان ارسال فوری وجود دارد.',
                    `هزینه‌ی ارسال برای سفارش‌های کمتر از ${money(policy.freeShippingFrom)}، ${money(policy.shippingCost)} است و برای سفارش‌های بالاتر رایگان است.`,
                    'زمان تحویل تخمینی است و ممکن است به‌دلیل شرایط پیش‌بینی‌نشده تغییر کند.',
                    'گیرنده هنگام تحویل باید سلامت ظاهری بسته را بررسی کند. در صورت آسیب‌دیدگی بسته، همان لحظه با پشتیبانی تماس بگیرید.',
                    'در صورت نادرست بودن آدرس یا در دسترس نبودن گیرنده، هزینه‌ی ارسال مجدد بر عهده‌ی کاربر است.',
                ],
            },
        ],
    },
    {
        id: 'returns',
        title: 'بازگشت کالا',
        blocks: [
            {
                type: 'p',
                text: `کاربر می‌تواند تا ${policy.returnDays.toLocaleString('fa-IR')} روز پس از تحویل کالا، درخواست بازگشت ثبت کند. شرایط بازگشت:`,
            },
            {
                type: 'list',
                items: [
                    'کالا استفاده نشده و سالم باشد و بسته‌بندی اصلی، لوازم همراه، کارت گارانتی و فاکتور را داشته باشد.',
                    'کالاهای مصرفی و بهداشتی (مانند هندزفری و هدفون بازشده) به‌دلیل ماهیتشان قابل بازگشت نیستند، مگر اینکه معیوب باشند.',
                    'اگر کالا معیوب باشد یا با سفارش شما مطابقت نداشته باشد، هزینه‌ی ارسال بازگشت بر عهده‌ی کیوی‌تک است.',
                    'در انصراف بدون دلیل، هزینه‌ی ارسال بازگشت بر عهده‌ی کاربر است.',
                    `پس از دریافت کالا و تایید کارشناسی، مبلغ ظرف ${policy.refundDays} به همان روش پرداخت (یا به کیف پول شما) بازگردانده می‌شود.`,
                ],
            },
            { type: 'note', text: 'پیش از ارسال کالا برای بازگشت، حتماً با پشتیبانی هماهنگ کنید.' },
        ],
    },
    {
        id: 'warranty',
        title: 'اصالت کالا و گارانتی',
        blocks: [
            {
                type: 'list',
                items: [
                    'کیوی‌تک اصالت کالاهای عرضه‌شده را تضمین می‌کند.',
                    'گارانتی کالاها مطابق کارت گارانتی شرکت تامین‌کننده و شرایط آن ارائه می‌شود.',
                    'در صورت اثبات غیراصل بودن کالا، کالا مرجوع و وجه پرداختی به‌طور کامل بازگردانده می‌شود.',
                    'آسیب فیزیکی، نفوذ مایعات و استفاده‌ی نادرست معمولاً از شمول گارانتی خارج هستند.',
                ],
            },
        ],
    },
    {
        id: 'privacy',
        title: 'حریم خصوصی کاربران',
        blocks: [
            {
                type: 'p',
                text: 'کیوی‌تک به حریم خصوصی کاربران احترام می‌گذارد و از اطلاعات آن‌ها فقط برای ارائه‌ی خدمات استفاده می‌کند.',
            },
            {
                type: 'list',
                items: [
                    'اطلاعات جمع‌آوری‌شده: نام، شماره موبایل، ایمیل (اختیاری)، آدرس‌ها و سابقه‌ی سفارش‌ها.',
                    'کاربرد اطلاعات: پردازش و ارسال سفارش، پشتیبانی و اطلاع‌رسانی وضعیت سفارش.',
                    'اطلاعات کاربران به فروش نمی‌رسد و فقط در حد لازم با شرکای ارسال و پرداخت، یا در صورت الزام قانونی با مراجع ذی‌صلاح به اشتراک گذاشته می‌شود.',
                    'برای ورود به حساب کاربری و نگهداری سبد خرید از کوکی و حافظه‌ی مرورگر استفاده می‌شود.',
                    'شما می‌توانید اطلاعات خود را از پنل کاربری ویرایش کنید و برای حذف حساب کاربری با پشتیبانی تماس بگیرید.',
                ],
            },
        ],
    },
    {
        id: 'reviews',
        title: 'نظرات کاربران',
        blocks: [
            {
                type: 'list',
                items: [
                    'نظرات پس از بررسی و تایید مدیر فروشگاه در صفحه‌ی محصول نمایش داده می‌شوند.',
                    'نظرات توهین‌آمیز، خلاف قانون، تبلیغاتی یا نامرتبط با محصول منتشر نمی‌شوند.',
                    'کیوی‌تک حق ویرایش یا حذف نظرات ناقض این قوانین را دارد.',
                    'مسئولیت محتوای هر نظر با نویسنده‌ی آن است.',
                ],
            },
        ],
    },
    {
        id: 'ip',
        title: 'مالکیت معنوی',
        blocks: [
            {
                type: 'p',
                text: 'تمامی محتوای وب‌سایت شامل لوگو، طراحی، متن‌ها، مقالات و تصاویر متعلق به کیوی‌تک یا تامین‌کنندگان آن است. هرگونه کپی‌برداری یا استفاده‌ی تجاری از آن‌ها بدون مجوز کتبی ممنوع است.',
            },
        ],
    },
    {
        id: 'liability',
        title: 'محدودیت مسئولیت',
        blocks: [
            {
                type: 'list',
                items: [
                    'کیوی‌تک تلاش می‌کند سایت همیشه در دسترس باشد، اما قطعی‌های موقت به‌دلیل نگهداری یا مشکلات فنی و زیرساختی ممکن است رخ دهد.',
                    'با وجود دقت در درج اطلاعات، خطاهای نگارشی یا اختلاف جزئی تصاویر و مشخصات ممکن است وجود داشته باشد؛ در چنین مواردی بازگشت کالا طبق قوانین بالا انجام می‌شود.',
                    'کیوی‌تک در برابر حوادث قهری و شرایط خارج از کنترل خود مسئولیتی ندارد.',
                ],
            },
        ],
    },
    {
        id: 'changes',
        title: 'تغییر در قوانین',
        blocks: [
            {
                type: 'p',
                text: 'کیوی‌تک می‌تواند این قوانین را در هر زمان به‌روزرسانی کند. نسخه‌ی جدید با انتشار در همین صفحه معتبر می‌شود و ادامه‌ی استفاده از سایت به معنی پذیرش آن است. تاریخ آخرین به‌روزرسانی بالای صفحه درج شده است.',
            },
        ],
    },
    {
        id: 'law',
        title: 'قوانین حاکم و حل اختلاف',
        blocks: [
            {
                type: 'p',
                text: 'این قوانین تابع قوانین جمهوری اسلامی ایران، از جمله قانون تجارت الکترونیکی و قانون حمایت از حقوق مصرف‌کنندگان است. در صورت بروز اختلاف، ابتدا از طریق پشتیبانی کیوی‌تک برای حل آن تلاش می‌شود و در غیر این صورت به مراجع صالح رسیدگی ارجاع می‌شود.',
            },
        ],
    },
    {
        id: 'contact',
        title: 'تماس با ما',
        blocks: [
            { type: 'p', text: 'برای هر سؤال درباره‌ی این قوانین یا سفارش‌هایتان، با ما در تماس باشید:' },
            { type: 'contact' },
        ],
    },
]

function SectionBlock({ block }: { block: Block }) {
    switch (block.type) {
        case 'p':
            return <p className='text-sm sm:text-base text-zinc-600 leading-8 wrap-break-word'>{block.text}</p>

        case 'list':
            return (
                <ul className='flex flex-col gap-2.5'>
                    {block.items.map(item => (
                        <li key={item} className='flex gap-2.5 text-sm sm:text-base text-zinc-600 leading-8'>
                            <span className='mt-3 w-1.5 h-1.5 shrink-0 rounded-full bg-primary-500' />
                            <span className='min-w-0 wrap-break-word'>{item}</span>
                        </li>
                    ))}
                </ul>
            )

        case 'note':
            return (
                <div className='flex items-start gap-2.5 p-4 text-sm leading-7 text-amber-800 bg-amber-50 border border-amber-200 rounded-xl'>
                    <PiInfoLight className='w-5 h-5 mt-1 shrink-0' />
                    <span>{block.text}</span>
                </div>
            )

        case 'contact':
            return (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <a href={store.phoneHref} className='flex items-center gap-3 p-4 bg-gray-50 hover:bg-primary-50/60 rounded-xl transition-colors'>
                        <PiPhoneCallLight className='w-6 h-6 shrink-0 text-primary-500' />
                        <span className='text-sm text-zinc-700'>{store.phone}</span>
                    </a>
                    <a href={`mailto:${store.email}`} className='flex items-center gap-3 p-4 bg-gray-50 hover:bg-primary-50/60 rounded-xl transition-colors'>
                        <PiEnvelopeSimpleLight className='w-6 h-6 shrink-0 text-primary-500' />
                        <span className='text-sm text-zinc-700 break-all' dir='ltr'>{store.email}</span>
                    </a>
                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-xl'>
                        <PiClockLight className='w-6 h-6 shrink-0 text-primary-500' />
                        <span className='text-sm text-zinc-700'>{store.hours}</span>
                    </div>
                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-xl'>
                        <PiMapPinLight className='w-6 h-6 shrink-0 text-primary-500' />
                        <span className='text-sm text-zinc-700 leading-7'>{store.address}</span>
                    </div>
                    <Link href='/contact' className='sm:col-span-2 flex-center h-11 text-sm text-text linear_btn'>
                        ارسال پیام به پشتیبانی
                    </Link>
                </div>
            )
    }
}

function TocList() {
    return (
        <ol className='flex flex-col gap-0.5'>
            {sections.map((section, index) => (
                <li key={section.id}>
                    <a
                        href={`#${section.id}`}
                        className='flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-primary-600 hover:bg-primary-50/60 rounded-lg transition-colors'
                    >
                        <span className='w-5 shrink-0 text-xs text-zinc-400'>{(index + 1).toLocaleString('fa-IR')}.</span>
                        {section.title}
                    </a>
                </li>
            ))}
        </ol>
    )
}

export default function RulesPage() {
    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'قوانین و مقررات', to: '/rules' },
                ]}
            />

            <div className='container px-3 sm:px-0 pb-16'>

                {/* Hero */}
                <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-50 via-white to-primary-100 px-5 sm:px-10 py-8 sm:py-12 text-center mb-6 sm:mb-8'>
                    <div className='absolute -top-16 -right-10 w-48 h-48 bg-primary-300/40 blur-3xl rounded-full' />
                    <div className='absolute -bottom-16 -left-10 w-48 h-48 bg-primary-200/40 blur-3xl rounded-full' />

                    <div className='relative z-10 max-w-2xl mx-auto'>
                        <span className='flex-center w-14 h-14 mx-auto mb-4 text-primary-600 bg-white/80 rounded-2xl shadow-sm'>
                            <PiScalesLight className='w-8 h-8' />
                        </span>
                        <h1 className='font-MorabbaBold text-2xl sm:text-4xl text-zinc-800 leading-relaxed'>قوانین و مقررات</h1>
                        <p className='mt-3 text-sm sm:text-base text-zinc-500 leading-8'>
                            لطفاً پیش از خرید، این قوانین را با دقت مطالعه کنید. هدف ما شفافیت و یک تجربه‌ی خرید مطمئن برای شماست.
                        </p>
                        <span className='inline-block mt-4 px-3 py-1 text-xs text-primary-700 bg-white/80 rounded-lg'>
                            آخرین به‌روزرسانی: {LAST_UPDATED}
                        </span>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-4 lg:gap-8 items-start'>

                    {/* فهرست مطالب: موبایل = بازشونده، دسکتاپ = ستون چسبان */}
                    <aside className='min-w-0'>
                        <details className='group lg:hidden bg-white shadow-lg rounded-2xl'>
                            <summary className='flex items-center justify-between gap-3 px-5 py-4 font-IranYekanBold text-sm text-zinc-800 cursor-pointer list-none [&::-webkit-details-marker]:hidden'>
                                فهرست مطالب
                                <PiCaretDownLight className='w-4 h-4 text-zinc-400 transition-transform group-open:rotate-180' />
                            </summary>
                            <div className='px-2 pb-3 max-h-72 overflow-y-auto'>
                                <TocList />
                            </div>
                        </details>

                        <div className='hidden lg:block lg:sticky lg:top-44 bg-white shadow-lg rounded-2xl p-3 max-h-[calc(100vh-13rem)] overflow-y-auto'>
                            <p className='px-3 pt-2 pb-3 font-IranYekanBold text-sm text-zinc-800'>فهرست مطالب</p>
                            <TocList />
                        </div>
                    </aside>

                    <div className='flex flex-col gap-4 sm:gap-5 min-w-0'>
                        {sections.map((section, index) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className='scroll-mt-28 sm:scroll-mt-48 bg-white shadow-lg rounded-2xl p-5 sm:p-7'
                            >
                                <h2 className='flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 font-IranYekanBold text-base sm:text-lg text-zinc-800'>
                                    <span className='flex-center w-8 h-8 shrink-0 text-xs text-primary-600 bg-primary-50 rounded-lg'>
                                        {(index + 1).toLocaleString('fa-IR')}
                                    </span>
                                    {section.title}
                                </h2>

                                <div className='flex flex-col gap-4'>
                                    {section.blocks.map((block, blockIndex) => (
                                        <SectionBlock key={blockIndex} block={block} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            <Footer marginClasses={'mt-16 sm:mt-20'} />
        </div>
    )
}
