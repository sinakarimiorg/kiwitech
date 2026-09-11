import AdminSidebar from "../templates/P-admin/AdminSidebar/AdminSidebar";
import Header from "../templates/P-admin/Header/Header";
import { ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {

  return (
    <div className='flex bg-background'>
      <div>
        <AdminSidebar />
      </div>
      <div className='flex-1'>
        <Header />
        {children}
      </div>
    </div>
  )
}

export default Layout;