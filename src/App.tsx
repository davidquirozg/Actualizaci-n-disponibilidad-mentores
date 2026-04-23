/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Bell, 
  User, 
  Info, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  Clock,
  ExternalLink,
  ShieldCheck,
  History,
  HelpCircle,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';

// Types
type Day = 'LUN' | 'MAR' | 'MIÉ' | 'JUE' | 'VIE' | 'SÁB' | 'DOM';
type TimeSlot = string;

interface ScheduleState {
  [day: string]: Set<TimeSlot>;
}

const DAYS: Day[] = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const TIMES: TimeSlot[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function App() {
  const [selectedSlots, setSelectedSlots] = useState<ScheduleState>(
    DAYS.reduce((acc, day) => ({ ...acc, [day]: new Set() }), {})
  );
  const [completeAvailability, setCompleteAvailability] = useState(false);

  // Mock historical data from image 3
  const HISTORIC_SLOTS: {[key: string]: string[]} = {
    'LUN': ['10:00', '12:00', '14:00'],
    'MAR': ['08:00', '10:00', '14:00'],
    'MIÉ': ['08:00', '10:00'],
    'JUE': ['08:00', '10:00', '12:00', '14:00', '16:00'],
    'VIE': ['10:00', '14:00', '16:00'],
  };

  const isHistoric = (day: string, time: string) => HISTORIC_SLOTS[day]?.includes(time);

  const toggleSlot = (day: Day, time: TimeSlot) => {
    setSelectedSlots(prev => {
      const newSet = new Set(prev[day]);
      if (newSet.has(time)) {
        newSet.delete(time);
      } else {
        newSet.add(time);
      }
      return { ...prev, [day]: newSet };
    });
  };

  const clearSchedule = () => {
    setSelectedSlots(DAYS.reduce((acc, day) => ({ ...acc, [day]: new Set() }), {}));
  };

  const totalHours = Object.values(selectedSlots).reduce((acc, set) => acc + (set as Set<TimeSlot>).size, 0) * 1; // Assuming 1h slots for accuracy to image grid density

  return (
    <div className="min-h-screen font-sans bg-background text-on-background">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-8 lg:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <span className="text-lg font-extrabold text-slate-900 uppercase tracking-widest">
              PORTAL ACADÉMICO
            </span>
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
              <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                Inicio
              </a>
              <a href="#" className="flex items-center gap-2 text-primary border-b-2 border-primary pb-1">
                Disponibilidad
              </a>
              <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                Historial
              </a>
              <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                Ayuda
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end border-r border-slate-200 pr-6">
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">TIEMPO RESTANTE</span>
              <span className="text-xl font-bold text-slate-900">05d 12h 30m</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-50 rounded-full transition-colors relative">
                <Bell size={22} className="text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer bg-slate-50 p-1 px-3 rounded-full border border-slate-200">
                <span className="text-sm font-semibold text-slate-700 hidden lg:inline">D. Quiroz</span>
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <User size={18} className="text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-12 py-10">
        {/* Title & Toggle Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de Disponibilidad</h1>
            <p className="text-slate-500 mt-1">Configure su horario recurrente para el periodo académico actual (Próximos 3 meses).</p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">¿DISPONIBILIDAD COMPLETA?</span>
            <button 
              onClick={() => setCompleteAvailability(!completeAvailability)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${completeAvailability ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${completeAvailability ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Reference Info & Legends */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Reference Info Card */}
            <section className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Información de Referencia</h3>
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">Periodo Histórico:</span>
                  <span className="font-bold text-slate-800 tracking-tight">2023-II</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">Horas previas:</span>
                  <span className="font-bold text-slate-800 tracking-tight">24 horas/sem</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary rounded shadow-sm"></div>
                  <span className="text-sm font-medium text-slate-700 font-bold">Nueva Disponibilidad</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 historic-reference rounded shadow-sm"></div>
                  <span className="text-sm font-medium text-slate-700">Horario 2023-II (Ref)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white border border-slate-200 rounded"></div>
                  <span className="text-sm font-medium text-slate-700">No disponible</span>
                </div>
              </div>
            </section>

            {/* Instruction Box */}
            <div className="bg-primary-fixed p-6 rounded-xl border border-primary/10">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Info size={18} className="text-primary font-bold" />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm mb-1 uppercase tracking-wider">Instrucciones</h4>
                  <p className="text-xs leading-relaxed text-on-primary-fixed-variant font-medium">
                    Haga clic sobre los bloques para definir su horario semanal fijo. El sombreado gris/magenta muestra su horario del periodo anterior como guía.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 cursor-pointer hover:bg-white transition-colors group">
              <span>CALENDARIO ACADÉMICO</span>
              <ExternalLink size={14} className="group-hover:text-primary" />
            </div>
          </div>

          {/* Right Column: Main Schedule Grid */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              {/* Grid Header Toolbar */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-xl font-bold text-slate-800">Horario Semanal Recurrente</h2>
                <div className="flex items-center gap-2 text-slate-400 italic text-[13px] font-medium">
                  <Calendar size={16} />
                  Válido por los próximos 3 meses
                </div>
              </div>

              {/* Grid Content */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Grid Header Days */}
                  <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-100 divide-x divide-slate-100">
                    <div className="p-4"></div>
                    {DAYS.map(day => (
                      <div key={day} className={`p-4 text-center text-xs font-bold tracking-widest ${day === 'SÁB' || day === 'DOM' ? 'text-[#e91e63]' : 'text-slate-500'}`}>
                        {day === 'LUN' ? 'LUNES' : 
                         day === 'MAR' ? 'MARTES' : 
                         day === 'MIÉ' ? 'MIÉRCOLES' : 
                         day === 'JUE' ? 'JUEVES' : 
                         day === 'VIE' ? 'VIERNES' : 
                         day === 'SÁB' ? 'SÁBADO' : 'DOMINGO'}
                      </div>
                    ))}
                  </div>

                  {/* Grid Time Rows */}
                  <div className="divide-y divide-slate-100">
                    {TIMES.map(time => (
                      <div key={time} className="grid grid-cols-8 divide-x divide-slate-100 hover:bg-slate-50/30 transition-colors">
                        <div className="p-4 text-right pr-6 text-xs font-bold text-slate-400 self-center">
                          {time}
                        </div>
                        {DAYS.map(day => (
                          <div 
                            key={`${day}-${time}`} 
                            onClick={() => toggleSlot(day, time)}
                            className={`h-11 cursor-pointer transition-all duration-150 relative
                              ${selectedSlots[day].has(time) ? 'selected' : ''}
                              ${!selectedSlots[day].has(time) && isHistoric(day, time) ? 'historic-reference' : ''}
                            `}
                          >
                             <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid Summary Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock size={18} className="text-primary" />
                  <span className="text-sm font-medium">Horas actuales seleccionadas: <strong className="text-slate-900 border-b-2 border-slate-400 font-extrabold ml-1 leading-none">{totalHours} horas/semana</strong></span>
                </div>
                <button 
                  onClick={clearSchedule}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors bg-white border border-slate-200 rounded-lg shadow-xs"
                >
                  <Trash2 size={14} />
                  Limpiar selección
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-10 p-8 bg-white border border-slate-200 rounded-xl flex flex-col xl:flex-row justify-between items-center gap-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-emerald-50 rounded-full border border-emerald-100">
              <CheckCircle2 className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Compromiso Académico</p>
              <p className="text-xs text-slate-500 max-w-xl mt-1 leading-relaxed font-medium">
                Al confirmar, usted declara que este horario semanal se mantendrá fijo durante todo el periodo académico actual y se compromete a estar disponible en las horas indicadas.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 w-full xl:w-auto">
            <button className="px-6 py-3.5 border-2 border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all uppercase tracking-wider">
              Guardar borrador
            </button>
            <button className="px-6 py-3.5 border-2 border-primary text-primary rounded-xl font-bold text-xs hover:bg-primary-fixed transition-all uppercase tracking-wider">
              Validar Selección
            </button>
            <button className="px-10 py-3.5 bg-primary text-white rounded-xl font-bold text-xs shadow-xl shadow-primary/20 hover:opacity-95 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest">
              Confirmar Disponibilidad Fija
            </button>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-20">
        <div className="max-w-[1440px] mx-auto px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Portal Académico &bull; Gestión Docente</span>
            <span className="text-[11px] text-slate-400 font-medium">© 2024 Institución Educativa. Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-[11px] font-bold text-slate-500 hover:text-primary transition-colors underline underline-offset-4 decoration-2">Privacidad</a>
            <a href="#" className="text-[11px] font-bold text-slate-500 hover:text-primary transition-colors underline underline-offset-4 decoration-2">Términos</a>
            <a href="#" className="text-[11px] font-extrabold text-slate-900 border-b-2 border-slate-300 hover:border-primary hover:text-primary transition-all uppercase tracking-widest">Soporte Técnico</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
