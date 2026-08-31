import { getAdminNotifications } from "@root/src/lib/admin/notifications";
import AdminSidebar from "../templates/P-admin/AdminSidebar/AdminSidebar";
import Header from "../templates/P-admin/Header/Header";



const Layout = async ({ children }: any) => {

    const notifications = await getAdminNotifications()

    return (
        <div className='flex bg-background'>
                    <div>
                      <AdminSidebar />
                    </div>
                    <div className='flex-1'>
                      <Header notifications={notifications} />
                      {children}
                    </div>
        </div>
    )
}

export default Layout;