import AdminSidebar from "../templates/p-admin/AdminSidebar/AdminSidebar";
import Header from "../templates/p-admin/Header/Header";



const Layout = async ({ children }: any) => {

    return (
        <div className='flex bg-background'>
                    <div>
                      <AdminSidebar />
                    </div>
                    <div className='flex-1'>
                      <Header/>
                      {children}
                    </div>
        </div>
    )
}

export default Layout;