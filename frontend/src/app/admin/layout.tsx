'use client';

import SidebarLayout from "../components/Sidebar";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
