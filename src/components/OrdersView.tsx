'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Eye, Calendar, Plus } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenNewOrder: () => void;
}

export default function OrdersView({ orders, onSelectOrder, onOpenNewOrder }: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');

  // Filter & Sort Logic
  const processedOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesSearch = 
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        const matchesPayment = paymentFilter === 'All' || order.paymentMethod === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'total-desc') {
          return b.total - a.total;
        }
        if (sortBy === 'total-asc') {
          return a.total - b.total;
        }
        return 0;
      });
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy]);

  const statusColors: Record<OrderStatus, string> = {
    'Pendiente': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'En Preparación': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Enviado': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Entregado': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Cancelado': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Registro de Pedidos</h2>
          <p className="text-sm text-slate-400">Listado, filtrado e histórico de transacciones.</p>
        </div>
        <button
          onClick={onOpenNewOrder}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Pedido</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 p-4 border border-slate-850 rounded-2xl backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-550 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Preparación">En Preparación</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Todos los Pagos</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </div>

        {/* Sorting selection */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="date-desc">Fecha: Recientes Primero</option>
            <option value="date-asc">Fecha: Antiguos Primero</option>
            <option value="total-desc">Total: Mayor a Menor</option>
            <option value="total-asc">Total: Menor a Mayor</option>
          </select>
        </div>

      </div>

      {/* Orders Table Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        {processedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/20 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Artículos</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Pago</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {processedOrders.map((order) => {
                  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const orderDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-850/20 transition-colors group"
                    >
                      <td className="px-6 py-4.5 font-mono font-bold text-white text-xs">{order.id}</td>
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{order.customerName}</span>
                          <span className="text-[10px] text-slate-500">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          {orderDate}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-xs text-slate-300 font-medium">
                        {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                      </td>
                      <td className="px-6 py-4.5 font-mono font-bold text-indigo-400 text-sm">
                        {order.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-4.5 text-xs text-slate-400 font-medium">{order.paymentMethod}</td>
                      <td className="px-6 py-4.5">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1 font-semibold text-xs cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500 flex flex-col items-center justify-center p-6">
            <div className="h-12 w-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-slate-600" />
            </div>
            <p className="font-semibold text-slate-400">No se encontraron pedidos</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Intente cambiar las palabras clave o restablecer los filtros de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
