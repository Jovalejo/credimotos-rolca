'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login')) {
          toast.error('Email o contraseña incorrectos');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Email no confirmado. Revisa tu correo.');
        } else {
          toast.error(error.message || 'Error al iniciar sesión');
        }
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        toast.success('Bienvenido a CrediMotos ROLCA');
        window.location.href = '/dashboard';
        return;
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('Error de conexión. Verifica tu internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Form Panel */}
      <div className="flex w-full md:w-[450px] flex-col justify-center px-8 sm:px-12 bg-[#17181C]/95 backdrop-blur z-10 shadow-2xl">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-red-600 bg-white shadow-lg">
              <Image
                src="/logo.jpg"
                alt="CrediMotos ROLCA Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                CREDIMOTOS ROLCA
              </h1>
              <p className="text-gray-400">
                Sistema de Gestión de Créditos
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@credimotosrolca.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-slate-900 border-0 focus-visible:ring-red-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-200">
                    Contraseña
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white text-slate-900 border-0 focus-visible:ring-red-600"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#A6182A] hover:bg-red-700 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Iniciando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
          
          <div className="text-center text-xs text-gray-500 font-medium">
            Panamericana Barrio El Topón | Tel: 0426-4345704
          </div>
        </div>
      </div>

      {/* Decorative Background */}
      <div 
        className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #17181C 0%, #17181C 50%, #A6182A 100%)'
        }}
      >
        <div className="absolute opacity-10 text-[30rem] select-none rotate-12 transform -translate-y-1/4">
          🏍️
        </div>
        <div className="z-10 text-center px-12">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-wide drop-shadow-lg">
            IMPULSANDO TUS SUEÑOS
          </h2>
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            La forma más rápida y segura de gestionar créditos y cobranzas.
          </p>
        </div>
      </div>
    </div>
  );
}
