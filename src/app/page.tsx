"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Shield, Clock, Percent, Phone, MapPin, MessageCircle, ChevronDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateFinancing } from "@/lib/calculations";
import { formatMoney } from "@/lib/utils";

const motorcycles = [
  { id: 1, brand: "Bera", model: "SBR", price: 950, emoji: "🏍️" },
  { id: 2, brand: "Empire", model: "EK Express", price: 980, emoji: "🏍️" },
  { id: 3, brand: "Keeway", model: "TX 200", price: 1450, emoji: "🏍️" },
  { id: 4, brand: "Suzuki", model: "GN 125", price: 1850, emoji: "🏍️" },
  { id: 5, brand: "Yamaha", model: "FZ 150", price: 2800, emoji: "🏍️" },
  { id: 6, brand: "Honda", model: "Navi", price: 1600, emoji: "🏍️" },
];

export default function LandingPage() {
  const [selectedMoto, setSelectedMoto] = useState(motorcycles[0].id);
  const [downPaymentPercent, setDownPaymentPercent] = useState(40);
  const [frequency, setFrequency] = useState("semanal");
  const [termMonths, setTermMonths] = useState(6);

  const moto = motorcycles.find(m => m.id === selectedMoto) || motorcycles[0];
  const motoPrice = moto.price;

  let periods = 1;
  if (frequency === "semanal") periods = termMonths * 4;
  else if (frequency === "quincenal") periods = termMonths * 2;
  else if (frequency === "mensual") periods = termMonths;

  // Basic mock calculation (interest rate 15% flat)
  const { downPayment, financedAmount, installmentAmount: quota } = calculateFinancing(motoPrice, downPaymentPercent, periods, 15);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-red-600/30">
      {/* Header / Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">ROLCA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-300 hover:text-white hover:bg-gray-800">
                <LogIn className="w-4 h-4 mr-2" />
                Ingresar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-gray-950 to-gray-950"></div>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-[250px] h-[250px] relative mb-8 rounded-full overflow-hidden border-4 border-red-600/20 shadow-2xl shadow-red-900/20 bg-gray-900">
            <Image 
              src="/logo.jpg" 
              alt="CrediMotos ROLCA C.A." 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            CREDIMOTOS <span className="text-red-600">ROLCA C.A.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl font-light">
            Tu moto soñada, a tu alcance. Financiamiento fácil, rápido y seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('catalogo')}
              className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 rounded-full"
            >
              Ver Catálogo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open('https://wa.me/584264345704', '_blank')}
              className="border-gray-700 hover:bg-gray-800 text-white text-lg h-14 px-8 rounded-full flex gap-2"
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              Contactar por WhatsApp
            </Button>
          </div>
        </div>
        <button 
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 animate-bounce text-gray-500 hover:text-white transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-900/50 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegirnos?</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/50 flex flex-col items-center text-center hover:bg-gray-800/60 transition-colors">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Crédito Seguro</h3>
              <p className="text-gray-400">Financiamiento flexible adaptado a tus necesidades con total transparencia.</p>
            </div>
            
            <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/50 flex flex-col items-center text-center hover:bg-gray-800/60 transition-colors">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Aprobación Rápida</h3>
              <p className="text-gray-400">Proceso de aprobación ágil. Obtén respuesta en menos de 24 horas.</p>
            </div>

            <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/50 flex flex-col items-center text-center hover:bg-gray-800/60 transition-colors">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                <Percent className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Las Mejores Tasas</h3>
              <p className="text-gray-400">Ofrecemos las tasas de financiamiento más competitivas del mercado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalogo" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Catálogo</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
              Descubre los modelos disponibles para financiamiento inmediato.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {motorcycles.map((moto) => (
              <div key={moto.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-red-900/50 transition-all duration-300">
                <div className="h-48 bg-gray-800 flex items-center justify-center text-6xl relative overflow-hidden">
                  <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">{moto.emoji}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-red-500 font-medium mb-1">{moto.brand}</p>
                      <h3 className="text-xl font-bold">{moto.model}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Contado</p>
                      <p className="font-bold text-lg">${moto.price}</p>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 mb-6 flex justify-between items-center border border-gray-700/50">
                    <span className="text-sm text-gray-400">Cuotas desde</span>
                    <span className="font-bold text-red-400">${Math.round((moto.price * 0.6) / 24)}/semana</span>
                  </div>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      setSelectedMoto(moto.id);
                      scrollToSection('simulador');
                    }}
                  >
                    Solicitar Crédito
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulador" className="py-24 bg-gray-900/50 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simulador de Crédito</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
              Calcula tus cuotas según el modelo, la inicial y el plazo que prefieras.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Controls */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Motocicleta</label>
                  <select 
                    value={selectedMoto}
                    onChange={(e) => setSelectedMoto(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                  >
                    {motorcycles.map(m => (
                      <option key={m.id} value={m.id}>{m.brand} {m.model} - ${m.price}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Inicial ({downPaymentPercent}%)
                  </label>
                  <input 
                    type="range" 
                    min="30" max="60" step="10"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>30%</span>
                    <span>40%</span>
                    <span>50%</span>
                    <span>60%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Frecuencia de Pago</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['semanal', 'quincenal', 'mensual'].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setFrequency(freq)}
                        className={`py-2 px-1 text-sm rounded-lg capitalize border ${
                          frequency === freq 
                            ? 'bg-red-600/20 border-red-600 text-white' 
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Plazo</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 6, 9, 12].map((meses) => (
                      <button
                        key={meses}
                        onClick={() => setTermMonths(meses)}
                        className={`py-2 px-1 text-sm rounded-lg border ${
                          termMonths === meses 
                            ? 'bg-red-600/20 border-red-600 text-white' 
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {meses} m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Percent className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Resumen de Financiamiento</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Precio de la moto:</span>
                  <span className="font-semibold">{formatMoney(motoPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Inicial a pagar ({downPaymentPercent}%):</span>
                  <span className="font-semibold text-green-400">{formatMoney(downPayment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monto a financiar:</span>
                  <span className="font-semibold">{formatMoney(financedAmount)}</span>
                </div>
                <div className="h-px bg-gray-800 my-4"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-gray-400 block mb-1">Cuota {frequency}:</span>
                    <span className="text-xs text-gray-500 block">Por {periods} cuotas</span>
                  </div>
                  <span className="text-3xl font-bold text-red-500">{formatMoney(quota)}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg"
                onClick={() => window.open(`https://wa.me/584264345704?text=Hola,%20me%20interesa%20financiar%20la%20moto%20${moto.brand}%20${moto.model}%20dando%20una%20inicial%20del%20${downPaymentPercent}%25.%20Vi%20que%20la%20cuota%20${frequency}%20sería%20de%20$${quota.toFixed(2)}.`, '_blank')}
              >
                Solicitar ahora por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Contáctanos</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-red-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg">Ubicación</h4>
                <p className="text-gray-400">Panamericana, Barrio El Topón</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-red-500">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg">Teléfono</h4>
                <p className="text-gray-400">0426-4345704</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-red-500">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg">Horario</h4>
                <p className="text-gray-400">Lunes a Sábado<br/>8:00 AM - 5:00 PM</p>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-14"
              onClick={() => window.open('https://wa.me/584264345704', '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chatear por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-900 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative overflow-hidden rounded-full grayscale">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-gray-500">ROLCA C.A.</span>
          </div>
          <p className="text-gray-600 text-sm">
            &copy; 2024 CrediMotos ROLCA C.A. Todos los derechos reservados.
          </p>
          <p className="text-gray-600 text-sm">
            Panamericana, Barrio El Topón
          </p>
        </div>
      </footer>
    </main>
  );
}
