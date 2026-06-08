'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, Mail, Phone, MapPin, DollarSign, ShoppingBag, X } from 'lucide-react';
import { Customer } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent'>) => Customer;
}

export default function CustomersView({ customers, onAddCustomer }: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  // Filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // Statistics
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageSpent = customers.length > 0 ? totalSpentAll / customers.length : 0;
  
  const topSpender = useMemo(() => {
    if (customers.length === 0) return null;
    return [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  }, [customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, address, city } = newCustomerForm;
    if (!name || !email || !address || !city) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }
    onAddCustomer({ name, email, phone, address, city });
    setNewCustomerForm({ name: '', email: '', phone: '', address: '', city: '' });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Directorio de Clientes</h2>
          <p className="text-sm text-slate-400">Listado, datos de contacto y estadísticas de consumo.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Cliente</span>
        </button>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Clientes Totales</span>
            <p className="text-xl font-bold text-white mt-0.5">{customers.length}</p>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Gasto Medio</span>
            <p className="text-xl font-bold text-white mt-0.5">
              {averageSpent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Mayor Comprador</span>
            <p className="text-sm font-bold text-white truncate max-w-[150px] mt-0.5" title={topSpender?.name}>
              {topSpender ? `${topSpender.name} (${topSpender.totalOrders} ped.)` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar clientes por nombre, correo o ciudad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-550 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Customers Table List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/20 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Dirección</th>
                  <th className="px-6 py-4 text-center">Pedidos</th>
                  <th className="px-6 py-4 text-right">Facturación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {c.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200 leading-none">{c.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">ID: {c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 space-y-1">
                      <p className="text-xs text-slate-350 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-slate-500 shrink-0" />
                        {c.email}
                      </p>
                      {c.phone && (
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                          {c.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4.5">
                      <p className="text-xs text-slate-350 flex items-center gap-1.5" title={c.address}>
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{c.address}, {c.city}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4.5 text-center font-mono font-bold text-white text-xs">
                      {c.totalOrders}
                    </td>
                    <td className="px-6 py-4.5 text-right font-mono font-bold text-indigo-400">
                      {c.totalSpent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500 flex flex-col items-center justify-center p-6 border-slate-800">
            <div className="h-12 w-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-3">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
            <p className="font-semibold text-slate-400">No se encontraron clientes</p>
            <p className="text-xs text-slate-500 mt-1">Modifique los términos de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Add Customer Modal Popup */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSubmit}
            className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-300 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-850">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-indigo-400" />
                Registrar Nuevo Cliente
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Martínez"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="laura@email.com"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Teléfono de Contacto</label>
                <input
                  type="text"
                  placeholder="+34 600 000 000"
                  value={newCustomerForm.phone}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Dirección Principal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Calle, Número, Escalera"
                    value={newCustomerForm.address}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Ciudad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Barcelona"
                    value={newCustomerForm.city}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-855">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-850 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
              >
                Guardar Cliente
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
