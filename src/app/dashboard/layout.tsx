"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  CreditCard, 
  Banknote, 
  LogOut, 
  Menu, 
  User as UserIcon
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Inventario", href: "/dashboard/inventario", icon: Bike },
  { name: "Créditos", href: "/dashboard/creditos", icon: CreditCard },
  { name: "Pagos", href: "/dashboard/pagos", icon: Banknote },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    toast.success("Sesión cerrada correctamente");
    router.push("/login");
  };

  const getPageTitle = () => {
    const item = navItems.find((i) => i.href === pathname);
    return item ? item.name : "Dashboard";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800 text-white">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-800">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="font-bold text-xl tracking-wider">ROLCA</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-red-600/10 text-red-500 font-medium" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-red-500" : "text-gray-400 group-hover:text-white"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[280px] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex-shrink-0`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-gray-900 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-white">Administrador</span>
              <span className="text-xs text-gray-400">admin@rolca.com</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <UserIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-950">
          {children}
        </div>
      </main>
    </div>
  );
}
