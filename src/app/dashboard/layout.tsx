'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Users,
  Banknote,
  Receipt,
  AlertTriangle,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const NAVIGATION = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
  { name: 'Registrar Abono', href: '/dashboard/abonos/registrar', icon: Banknote },
  { name: 'Abonos', href: '/dashboard/abonos', icon: Receipt },
  { name: 'Cobranza', href: '/dashboard/cobranza', icon: AlertTriangle },
  { name: 'Reporte Diario', href: '/dashboard/reporte-diario', icon: CalendarDays },
  { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const currentPage = NAVIGATION.find((item) => item.href === pathname)?.name || 'Dashboard';

  if (!mounted) {
    return null; // Prevents hydration mismatch with pathname
  }

  return (
    <div className="flex min-h-screen bg-[var(--rolca-paper)]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-[#17181C] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 px-6 py-4 border-b border-white/10">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#A6182A] bg-white">
            <Image
              src="/logo.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-sm tracking-wide">CREDIMOTOS ROLCA</span>
          <button 
            className="ml-auto lg:hidden p-1 rounded-md hover:bg-white/10"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          {NAVIGATION.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white/10 text-white border-l-4 border-[#A6182A] shadow-sm" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-[#A6182A]" : "")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-md lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-[#17181C] hidden sm:block">
              {currentPage}
            </h1>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="relative hidden md:block w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar clientes, abonos, reportes..."
                className="w-full bg-slate-50/50 pl-10 border-slate-200 focus-visible:ring-[#A6182A] focus-visible:border-[#A6182A] rounded-full h-9 text-sm"
              />
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0 hover:bg-slate-200 cursor-pointer transition-colors">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
