'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Info, ExternalLink, Activity } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (role: string, email: string) => void;
}

// Local mock credentials database
const MOCK_USERS = [
  { email: 'admin@zenith.com', password: 'password123', role: 'superadmin', name: 'Administrador General' },
  { email: 'medico@clinica.com', password: 'medico123', role: 'médico', name: 'Dr. Alejandro Ríos' },
  { email: 'paciente@clinica.com', password: 'paciente123', role: 'paciente', name: 'Sofía Peralta' },
];

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  // Redirection states
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [redirectUrl, setRedirectUrl] = useState('');

  // Auto-fill test accounts helper
  const handleQuickFill = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
  };

  // Email validation regex
  const validateEmail = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  // Handle countdown for external redirection
  useEffect(() => {
    if (isRedirecting && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isRedirecting && countdown === 0) {
      window.location.href = redirectUrl;
    }
  }, [isRedirecting, countdown, redirectUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Validate inputs
    if (!email) {
      setEmailError('El correo electrónico es obligatorio.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Formato de correo electrónico no válido.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria.');
      hasError = true;
    }

    if (hasError) return;

    // Search user in mock DB
    const matchedUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matchedUser) {
      // Role recognized -> Trigger successful login callback
      onLoginSuccess(matchedUser.role, matchedUser.email);
    } else {
      // Check if it qualifies as a "new user/new client structure"
      // Any valid formatted email that is NOT in the database triggers this redirection exception
      const userExistsInDb = MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userExistsInDb) {
        // Run exception handling: notify user and trigger auto-redirection to external patients registration system
        const targetExternalUrl = 'https://github.com/CarlosLDC/sistema-gestion-pedidos#registro-externo-pacientes';
        setRedirectUrl(targetExternalUrl);
        setIsRedirecting(true);
      } else {
        // Wrong password for existing user
        setGeneralError('Contraseña incorrecta. Por favor intente de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Logo and header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">Zenith Portal</h2>
          <p className="text-xs text-slate-400">Inicio de Sesión Unificado para Médicos, Pacientes y Administradores</p>
        </div>

        {/* Informative redirection screen if triggered */}
        {isRedirecting ? (
          <div className="p-5 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl space-y-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-center text-indigo-400">
              <Info className="h-10 w-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Usuario no registrado</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Su correo pertenece a la estructura de un client nuevo. Le estamos redirigiendo automáticamente al sistema externo de registro de pacientes.
              </p>
            </div>
            
            {/* Visual timer progress */}
            <div className="space-y-1.5 pt-2">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 3) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Redirigiendo en {countdown} segundos...</p>
            </div>

            <a
              href={redirectUrl}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold mt-2"
            >
              <span>Ir de inmediato</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          /* Normal Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* General Errors */}
            {generalError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-450">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="ejemplo@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-950/40 border rounded-xl text-sm text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-all ${
                    emailError ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {emailError && <p className="text-xs text-rose-450 font-medium">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400">Contraseña</label>
                <span className="text-[10px] text-slate-500">Mín. 6 caracteres</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/40 border rounded-xl text-sm text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-all ${
                    passwordError ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-rose-450 font-medium">{passwordError}</p>}
            </div>

            {/* Actions */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-650/10 hover:shadow-indigo-650/25 transition-all cursor-pointer mt-4"
            >
              Iniciar Sesión
            </button>
          </form>
        )}

        {/* Footer credentials reminder */}
        <div className="border-t border-slate-850 pt-4 text-[10px] text-slate-500 flex flex-col space-y-2 text-center">
          <p className="font-semibold text-slate-450">Cuentas de Prueba (Haz clic para autorellenar):</p>
          <div className="grid grid-cols-1 gap-1.5 text-xs text-left max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@zenith.com', 'password123')}
              className="px-3 py-1.5 bg-slate-950/50 border border-slate-850 hover:border-slate-750 hover:bg-slate-950 rounded-xl text-slate-400 hover:text-white flex items-center justify-between transition-all cursor-pointer font-sans"
            >
              <span>Admin: <code className="text-indigo-400">admin@zenith.com</code></span>
              <span className="font-mono text-2xs text-slate-500">Clave: password123</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('medico@clinica.com', 'medico123')}
              className="px-3 py-1.5 bg-slate-950/50 border border-slate-850 hover:border-slate-750 hover:bg-slate-950 rounded-xl text-slate-400 hover:text-white flex items-center justify-between transition-all cursor-pointer font-sans"
            >
              <span>Médico: <code className="text-indigo-400">medico@clinica.com</code></span>
              <span className="font-mono text-2xs text-slate-500">Clave: medico123</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('paciente@clinica.com', 'paciente123')}
              className="px-3 py-1.5 bg-slate-950/50 border border-slate-850 hover:border-slate-750 hover:bg-slate-950 rounded-xl text-slate-400 hover:text-white flex items-center justify-between transition-all cursor-pointer font-sans"
            >
              <span>Paciente: <code className="text-indigo-400">paciente@clinica.com</code></span>
              <span className="font-mono text-2xs text-slate-500">Clave: paciente123</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
