'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Heart, 
  ShieldAlert, 
  Clock,
  Check,
  ChevronRight
} from 'lucide-react';

interface DoctorViewProps {
  doctorName: string;
  doctorEmail: string;
  onLogout: () => void;
}

export default function DoctorView({ doctorName, doctorEmail, onLogout }: DoctorViewProps) {
  const [appointments, setAppointments] = useState([
    { id: 'CITA-201', patientName: 'Sofía Peralta', time: '09:00 AM', reason: 'Control Cardiológico', status: 'Atendido' },
    { id: 'CITA-202', patientName: 'Carlos Mendoza', time: '10:30 AM', reason: 'Evaluación General', status: 'Pendiente' },
    { id: 'CITA-203', patientName: 'Ana Gómez Román', time: '12:00 PM', reason: 'Revisión Resultados Laboratorio', status: 'Pendiente' },
    { id: 'CITA-204', patientName: 'Luis Rodríguez Silva', time: '03:30 PM', reason: 'Chequeo de Presión Arterial', status: 'Pendiente' },
  ]);

  const [activePatients, setActivePatients] = useState([
    { name: 'Sofía Peralta', age: 28, condition: 'Hipertensión Leve', lastVisit: '08 de Jun, 2026' },
    { name: 'Carlos Mendoza', age: 45, condition: 'Diabetes Tipo 2 (Controlada)', lastVisit: '01 de Jun, 2026' },
    { name: 'Ana Gómez Román', age: 34, condition: 'Ninguna (Chequeo anual)', lastVisit: '15 de May, 2026' },
  ]);

  const handleAttendAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId ? { ...app, status: 'Atendido' } : app
    ));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Doctor Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-850 flex flex-col h-full shrink-0 text-slate-300">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-850 bg-slate-950/20">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-base leading-none">Portal Médico</h1>
            <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">Sistema de Salud</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Menú Principal
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500/10 to-red-500/10 text-white border-l-2 border-rose-500">
            <Calendar className="h-5 w-5 text-rose-400" />
            <span>Agenda del Día</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-850/50 border-l-2 border-transparent">
            <Users className="h-5 w-5" />
            <span>Pacientes</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-850/50 border-l-2 border-transparent">
            <FileText className="h-5 w-5" />
            <span>Informes Clínicos</span>
          </button>
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-850 bg-slate-950/20 space-y-3">
          <div className="flex items-center gap-3 p-1">
            <div className="h-9 w-9 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-xs">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{doctorName}</p>
              <p className="text-[10px] text-slate-500 truncate">Cardiólogo</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Consulta en Curso</span>
          </div>
          <span className="text-xs font-bold text-slate-350">{doctorEmail}</span>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header info */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Bienvenido de nuevo, {doctorName}</h2>
              <p className="text-sm text-slate-400">Aquí está el resumen de sus citas agendadas y pacientes clínicos para hoy.</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Citas Hoy</span>
                  <p className="text-xl font-bold text-white mt-0.5">{appointments.length}</p>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Citas Pendientes</span>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {appointments.filter(a => a.status === 'Pendiente').length}
                  </p>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Pacientes Activos</span>
                  <p className="text-xl font-bold text-white mt-0.5">{activePatients.length}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Appointments list (2/3 width) */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Pacientes Agendados</h3>
                  <p className="text-xs text-slate-400">Gestione y atienda a los pacientes en lista de espera.</p>
                </div>

                <div className="divide-y divide-slate-850">
                  {appointments.map((app) => (
                    <div key={app.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{app.patientName}</p>
                          <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">
                            {app.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>{app.time} • Motivo: <span className="italic">{app.reason}</span></span>
                        </p>
                      </div>

                      <div>
                        {app.status === 'Atendido' ? (
                          <span className="px-2.5 py-1 text-2xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>Atendido</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAttendAppointment(app.id)}
                            className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                          >
                            Atender Paciente
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient conditions warning feed (1/3 width) */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Alertas Médicas</h3>
                  <p className="text-xs text-slate-400">Seguimiento de condiciones clínicas críticas.</p>
                </div>

                <div className="space-y-3 flex-1 pt-2">
                  {activePatients.map((pat, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{pat.name}</span>
                        <span className="text-slate-550 text-[10px] font-medium">Edad: {pat.age} años</span>
                      </div>
                      <p className="text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
                        <ShieldAlert className="h-3 w-3 text-rose-400" />
                        <span>Condición: {pat.condition}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <button className="w-full text-center text-xs text-rose-400 font-semibold hover:text-rose-300 transition-colors pt-2 border-t border-slate-850 mt-4 flex items-center justify-center gap-0.5">
                  <span>Ver Todos los Expedientes</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>
        </main>

      </div>

    </div>
  );
}
