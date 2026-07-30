import BreadCrumb from '../modules/breadCrumb/breadCrumb'
import Header from '../modules/header/header'
import Footer from '../modules/footer/footer'
import ProfileSidebar from '../templates/p-user/ProfileSidebar/ProfileSidebar'



const Layout = async ({ children }: any) => {

    return (
        <div>
            <Header />

            <BreadCrumb
                links={[
                    { id: 1, title: 'فروشگاه کیوی‌تک', to: '/' },
                    { id: 2, title: 'پروفایل من', to: '/profile' },
                ]}
            />

            <div className='container pb-10'>
                <div className='flex flex-col lg:flex-row gap-6'>

                    <ProfileSidebar active='personal-info' />
                        {children}
                </div>
            </div>


            <Footer marginClasses={''} />

        </div>
    )
}

export default Layout;