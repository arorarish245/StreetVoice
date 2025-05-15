'use client';
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart, Bell, Settings, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
  { label: "Reports", icon: <BarChart size={20} />, href: "/admin/reports" },
  { label: "Notifications", icon: <Bell size={20} />, href: "/admin/notifications" },
  { label: "Settings", icon: <Settings size={20} />, href: "/admin/settings" },
  { label: "Logout", icon: <LogOut size={20} />, href: "/logout" },
];

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B262C] text-white fixed h-full shadow-xl flex flex-col justify-between py-6 px-4">
        <div>
          <h2 className="text-2xl font-bold text-[#BBE1FA] mb-10 text-center">
            StreetVoice Admin
          </h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-[#3282B8] text-white"
                      : "hover:bg-[#0F4C75]"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <footer className="text-sm text-[#BBE1FA] text-center">
          © 2025 StreetVoice
        </footer>
      </aside>

      {/* Page Content */}
      <main className="ml-64 w-full p-6 bg-[#BBE1FA] min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
