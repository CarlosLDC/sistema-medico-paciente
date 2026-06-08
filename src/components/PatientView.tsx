'use client';

import React from 'react';
import { 
  FileText, 
  Calendar, 
  Activity, 
  Download, 
  MapPin, 
  Phone, 
  LogOut,
  User,
  Heart,
  FileSpreadsheet
} from 'lucide-react';

interface PatientViewProps {
  patientName: string;
  patientEmail: string;
  onLogout: () => void;
}

export default function PatientView({ patientName, patientEmail, onLogout }: PatientViewProps) {
  const prescriptions = [
    { id: 'REC-901', name: 'Aspirina 100mg', dosage: '1 comprimido diario', doctor: 'Dr. Alejandro Ríos', date: '01 Jun, 2026' },
    { id: 'REC-902', name: 'Ramipril 5mg', dosage: '1 comprimido cada 24h', doctor: 'Dr. Alejandro Ríos', date: '01 Jun, 2026' },
  ];

  const labReports = [
    { name: 'Perfil Lipídico Completo', date: '28 May, 2026', status: 'Completado', result: 'Ver informe' },
    { name: 'Hemograma Completo', date: '28 May, 2026', status: 'Completado', result: 'Ver informe' },
    { name: 'Electrocardiograma de Control', date: '01 Jun, 2026', status: 'Completado', result: 'Ver informe' },
  ];

  const handleDownload = (name: string) => {
    alert(`Descargando receta / informe para: ${name} (Simulación en PDF)`);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Patient Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-850 flex flex-col h-full shrink-0 text-slate-300">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-850 bg-slate-950/20">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-base leading-none">Mi Salud</h1>
            <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">Portal de Pacientes</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Mi Panel
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-white border-l-2 border-indigo-500">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>Mi Historial</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-850/50 border-l-2 border-transparent">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Mis Recetas</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-850/50 border-l-2 border-transparent">
            <Calendar className="h-5 w-5" />
            <span>Citas Médicas</span>
          </button>
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-850 bg-slate-950/20 space-y-3">
          <div className="flex items-center gap-3 p-1">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              SP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{patientName}</p>
              <p className="text-[10px] text-slate-500 truncate">Paciente ID #8849</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-500" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Portal del Paciente Activo</span>
          </div>
          <span className="text-xs font-bold text-slate-350">{patientEmail}</span>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Greetings */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">¡Hola, {patientName}!</h2>
              <p className="text-sm text-slate-400">Acceda a sus recetas médicas recetadas y reportes de laboratorio en tiempo real.</p>
            </div>

            {/* Next Appointment Warning widget */}
            <div className="p-4.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Próxima Consulta Agendada</h4>
                  <p className="text-xs text-slate-400 mt-1">Dr. Alejandro Ríos (Control Cardiológico) • Martes, 09 de Jun a las 09:00 AM</p>
                </div>
              </div>
              <div className="text-xs text-slate-450 flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Consultorio 142</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +34 912 345 678</span>
              </div>
            </div>

            {/* Split layout: Prescriptions & Lab Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Prescriptions */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Mis Recetas Activas</h3>
                  <p className="text-xs text-slate-400">Descargue las prescripciones médicas aprobadas para su tratamiento.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {prescriptions.map((rec) => (
                    <div key={rec.id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Heart className="h-4 w-4 text-rose-500" />
                          <h4 className="text-sm font-bold text-white">{rec.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{rec.dosage}</p>
                        <p className="text-[10px] text-slate-500 mt-1.5">{rec.doctor} • Emitida: {rec.date}</p>
                      </div>
                      
                      <button
                        onClick={() => handleDownload(rec.name)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white rounded-lg border border-slate-700 transition-all cursor-pointer"
                        title="Descargar receta en PDF"
                      >
                        <Download className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Reports */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Informes de Laboratorio</h3>
                  <p className="text-xs text-slate-400">Resultados de exámenes de sangre, placas y ecografías.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {labReports.map((rep, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-indigo-450" />
                          <h4 className="text-sm font-bold text-white">{rep.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Fecha de análisis: {rep.date}</p>
                      </div>

                      <button
                        onClick={() => handleDownload(rep.name)}
                        className="px-2.5 py-1 text-2xs font-semibold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/15 rounded-lg transition-colors cursor-pointer"
                      >
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

    </div>
  );
}
