"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock auth simulation
    setTimeout(() => {
      if (email === "admin@rolca.com" && password === "admin123") {
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
      } else {
        toast.error("Credenciales incorrectas. Intente nuevamente.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
        
        <Card className="bg-gray-900 border-gray-800 text-white shadow-2xl">
          <CardHeader className="space-y-4 flex flex-col items-center pt-8">
            <div className="w-[120px] h-[120px] relative rounded-full overflow-hidden border-2 border-red-600/30">
              <Image 
                src="/logo.jpg" 
                alt="Logo ROLCA" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
              <CardDescription className="text-gray-400">
                Accede al panel de administración
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@rolca.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-950 border-gray-800 focus-visible:ring-red-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-950 border-gray-800 focus-visible:ring-red-600 text-white"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white mt-4 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <p className="text-xs text-gray-500">
              Uso exclusivo para personal autorizado.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
