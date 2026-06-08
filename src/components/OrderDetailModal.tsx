'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Clock, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  Truck,
  Play,
  XCircle,
  PackageCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus, note: string) => void;
}

export default function OrderDetailModal({ order, onClose, onUpdateStatus }: OrderDetailModalProps) {
  const [transitionNote, setTransitionNote] = useState('');
  const [showNoteField, setShowNoteField] = useState(false);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);

  if (!order) return null;

  const handleStatusChangeClick = (status: OrderStatus) => {
    setTargetStatus(status);
    setShowNoteField(true);
  };

  const submitStatusChange = () => {
    if (targetStatus) {
      const note = transitionNote.trim() || `Estado cambiado a ${targetStatus}.`;
      onUpdateStatus(order.id, targetStatus, note);
      setTransitionNote('');
      setShowNoteField(false);
      setTargetStatus(null);
    }
  };

  const statusColors: Record<OrderStatus, string> = {
    'Pendiente': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'En Preparación': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Enviado': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Entregado': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Cancelado': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const getTimelineIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pendiente': return Clock;
      case 'En Preparación': return Play;
      case 'Enviado': return Truck;
      case 'Entregado': return CheckCircle;
      case 'Cancelado': return XCircle;
    }
  };

  // Determine what next status choices are available
  const getNextAvailableStatuses = (current: OrderStatus): OrderStatus[] => {
    switch (current) {
      case 'Pendiente':
        return ['En Preparación', 'Cancelado'];
      case 'En Preparación':
        return ['Enviado', 'Cancelado'];
      case 'Enviado':
        return ['Entregado'];
      case 'Entregado':
      case 'Cancelado':
      default:
        return [];
    }
  };

  const nextOptions = getNextAvailableStatuses(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content Drawer */}
      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col text-slate-300 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-850">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white font-mono">{order.id}</h3>
            <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* Main order detail and list (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Delivery Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info Card */}
              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Información del Cliente
                </h4>
                <div>
                  <p className="text-sm font-semibold text-white">{order.customerName}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> {order.customerEmail}
                  </p>
                </div>
              </div>

              {/* Delivery / Payment Card */}
              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Envío y Pago
                </h4>
                <div className="text-xs space-y-1">
                  <p className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <CreditCard className="h-3 w-3 text-slate-400" /> Método: {order.paymentMethod}
                  </p>
                  <p className="text-slate-400 mt-1 truncate" title={order.shippingAddress}>
                    Dirección: {order.shippingAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Product items list */}
            <div className="border border-slate-850 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-950/25 border-b border-slate-850">
                <h4 className="text-sm font-bold text-white">Artículos del Pedido</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-850 bg-slate-950/10 text-xs text-slate-400 font-bold uppercase">
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3 text-right">Precio</th>
                      <th className="px-4 py-3 text-center">Cant.</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/10">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white">{item.productName}</p>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {item.productId}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-400">
                          {item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-white">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-white">
                          {(item.price * item.quantity).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdowns */}
              <div className="p-4 bg-slate-950/30 border-t border-slate-850 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-mono text-slate-300">
                    {order.subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IVA (21%):</span>
                  <span className="font-mono text-slate-300">
                    {order.tax.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Descuento:</span>
                    <span className="font-mono font-semibold">
                      -{order.discount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-slate-850 pt-2 text-white">
                  <span>Total Pedido:</span>
                  <span className="font-mono text-indigo-400">
                    {order.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status updates control section */}
            {nextOptions.length > 0 ? (
              <div className="p-4 bg-slate-950/20 border border-slate-850 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Acciones de Transición de Estado
                </h4>
                
                {!showNoteField ? (
                  <div className="flex flex-wrap gap-2.5">
                    {nextOptions.map((status) => {
                      const colors: Record<string, string> = {
                        'En Preparación': 'bg-indigo-600 hover:bg-indigo-500 text-white',
                        'Enviado': 'bg-blue-600 hover:bg-blue-500 text-white',
                        'Entregado': 'bg-emerald-600 hover:bg-emerald-500 text-white',
                        'Cancelado': 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/20',
                      };
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChangeClick(status)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1 cursor-pointer ${colors[status]}`}
                        >
                          {status === 'Cancelado' ? <XCircle className="h-3.5 w-3.5" /> : <PackageCheck className="h-3.5 w-3.5" />}
                          <span>Pasar a {status}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-indigo-400 font-semibold">
                        Añadir nota para la transición a <span className="underline font-bold">{targetStatus}</span>:
                      </p>
                      <button 
                        onClick={() => setShowNoteField(false)} 
                        className="text-[10px] text-slate-500 hover:text-slate-300 uppercase font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                    <textarea
                      value={transitionNote}
                      onChange={(e) => setTransitionNote(e.target.value)}
                      placeholder="Ej: Embalaje completado, transportista asignado, nota de seguimiento #..."
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[60px]"
                    />
                    <button
                      onClick={submitStatusChange}
                      className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow transition-colors cursor-pointer"
                    >
                      Confirmar Cambio de Estado
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl text-center text-xs text-slate-500 font-medium">
                Este pedido ha finalizado y no se pueden realizar más transiciones de estado ({order.status}).
              </div>
            )}
          </div>

          {/* Sidebar vertical timeline (1 column) */}
          <div className="bg-slate-950/30 border border-slate-850 rounded-xl p-5 flex flex-col space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">Línea de Tiempo del Pedido</h4>
              <p className="text-xs text-slate-500">Historial y notas de cambios de estado.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6 pb-2">
                {order.history.map((hist, idx) => {
                  const Icon = getTimelineIcon(hist.status);
                  const isLast = idx === order.history.length - 1;
                  
                  return (
                    <div key={idx} className="relative">
                      {/* Timeline Node Dot */}
                      <span className={`absolute -left-[37px] top-0 h-6.5 w-6.5 rounded-full flex items-center justify-center border-2 border-slate-900 ${
                        isLast ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="h-3 w-3" />
                      </span>
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <span className={`text-xs font-bold leading-none ${isLast ? 'text-white' : 'text-slate-400'}`}>
                            {hist.status}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(hist.timestamp).toLocaleDateString('es-ES', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-450 italic leading-relaxed">
                          {hist.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
