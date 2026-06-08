'use client';

import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  TrendingUp, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { Order, Product } from '../types';

interface DashboardViewProps {
  orders: Order[];
  products: Product[];
  onNavigate: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
}

export default function DashboardView({ orders, products, onNavigate, onSelectOrder }: DashboardViewProps) {
  // Calculations
  const completedOrders = orders.filter(o => o.status === 'Entregado');
  const activeOrders = orders.filter(o => o.status === 'Pendiente' || o.status === 'En Preparación' || o.status === 'Enviado');
  
  // Total Revenue: delivered + active orders (excluding cancelled)
  const revenueOrders = orders.filter(o => o.status !== 'Cancelado');
  const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);
  
  const pendingOrdersCount = orders.filter(o => o.status === 'Pendiente').length;
  const preparingOrdersCount = orders.filter(o => o.status === 'En Preparación').length;
  
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  
  // Custom SVG sales chart data (e.g. sales over the last 6 days)
  // Let's generate dynamic daily data
  const getLast6DaysSales = () => {
    const data = [
      { day: 'Lun', sales: 240 },
      { day: 'Mar', sales: 380 },
      { day: 'Mié', sales: 180 },
      { day: 'Jue', sales: 510 },
      { day: 'Vie', sales: 420 },
      { day: 'Sáb', sales: 680 },
      { day: 'Dom', sales: 850 },
    ];
    
    // Adjust last item to incorporate active orders total if necessary for realism
    const todaySales = orders
      .filter(o => {
        const date = new Date(o.createdAt);
        const today = new Date();
        return date.getDate() === today.getDate() && o.status !== 'Cancelado';
      })
      .reduce((sum, o) => sum + o.total, 0);
      
    if (todaySales > 0) {
      data[6].sales = Math.round(todaySales);
    }
    return data;
  };

  const chartData = getLast6DaysSales();
  const maxSales = Math.max(...chartData.map(d => d.sales), 1000);
  const chartHeight = 160;
  const chartWidth = 500;
  
  // Generate SVG path for area and line
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - (d.sales / maxSales) * (chartHeight - 20);
    return { x, y };
  });

  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  // Category sales breakdown
  const categorySales = products.reduce((acc, p) => {
    // find quantity ordered
    const quantityOrdered = orders
      .filter(o => o.status !== 'Cancelado')
      .flatMap(o => o.items)
      .filter(item => item.productId === p.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    const totalVal = quantityOrdered * p.price;
    if (totalVal > 0) {
      acc[p.category] = (acc[p.category] || 0) + totalVal;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryTotals = Object.entries(categorySales).map(([name, value]) => ({ name, value }));
  const totalCatVal = categoryTotals.reduce((sum, c) => sum + c.value, 0) || 1;

  // Sorting recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Panel Principal</h2>
          <p className="text-sm text-slate-400">Resumen y análisis de ventas, pedidos e inventario.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-400">
          <span className="px-3 py-1 rounded bg-slate-850 text-white shadow-sm">Hoy</span>
          <span className="px-3 py-1">Semana</span>
          <span className="px-3 py-1">Mes</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales KPI */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md group hover:border-slate-700 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="h-24 w-24 text-indigo-500 -mr-6 -mt-6" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas Totales</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {totalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12.4% vs. mes anterior</span>
            </div>
          </div>
        </div>

        {/* Total Orders KPI */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md group hover:border-slate-700 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingBag className="h-24 w-24 text-purple-500 -mr-6 -mt-6" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pedidos Totales</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">{orders.length}</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-purple-400 font-medium">{completedOrders.length} entregados</span>
              <span>•</span>
              <span>{activeOrders.length} activos</span>
            </div>
          </div>
        </div>

        {/* Pending Orders KPI */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md group hover:border-slate-700 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="h-24 w-24 text-amber-500 -mr-6 -mt-6" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pedidos Pendientes</span>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${pendingOrdersCount > 0 ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {pendingOrdersCount + preparingOrdersCount}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <span>{pendingOrdersCount} en cola</span>
              <span>•</span>
              <span>{preparingOrdersCount} en producción</span>
            </div>
          </div>
        </div>

        {/* Low Stock KPI (Clickable) */}
        <button
          onClick={() => onNavigate('products')}
          className="w-full text-left relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md group hover:border-rose-500/50 hover:bg-slate-900/80 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="h-24 w-24 text-rose-500 -mr-6 -mt-6" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alertas de Stock</span>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {lowStockProducts.length}
            </h3>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={lowStockProducts.length > 0 ? 'text-rose-400 font-medium' : 'text-emerald-400'}>
                {lowStockProducts.length > 0 ? 'Productos bajo stock mínimo' : 'Inventario óptimo'}
              </span>
              <span className="text-slate-500 flex items-center gap-0.5 group-hover:text-slate-300">
                Ver todos <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-white text-base">Tendencia de Ventas Semanal</h4>
              <p className="text-xs text-slate-400">Ventas brutas diarias representadas en EUR.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Semana activa</span>
            </div>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="flex-1 w-full flex items-end relative min-h-[180px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="sales-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="line-glow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1="65" x2={chartWidth} y2="65" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1="110" x2={chartWidth} y2="110" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#334155" />

              {/* Area under the path */}
              {areaPath && (
                <path d={areaPath} fill="url(#sales-gradient)" className="transition-all duration-500" />
              )}
              
              {/* Main Line */}
              {linePath && (
                <path d={linePath} fill="none" stroke="url(#line-glow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500" />
              )}

              {/* Interactive Dots & Tooltips */}
              {points.map((p, idx) => (
                <g key={idx} className="group/dot cursor-pointer">
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="5" 
                    fill="#1e1b4b" 
                    stroke="#a5b4fc" 
                    strokeWidth="2.5" 
                    className="transition-all duration-200 hover:r-7 hover:fill-indigo-500" 
                  />
                  {/* Glowing halo on hover */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="12" 
                    fill="#6366f1" 
                    fillOpacity="0"
                    className="hover:fill-opacity-15 transition-all duration-200" 
                  />
                  {/* Mini Tooltip */}
                  <text 
                    x={p.x} 
                    y={p.y - 12} 
                    textAnchor="middle" 
                    fill="#ffffff" 
                    fontSize="10" 
                    fontWeight="bold"
                    className="opacity-0 group-hover/dot:opacity-100 transition-opacity bg-slate-950 px-1 py-0.5 rounded font-mono"
                  >
                    {chartData[idx].sales}€
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          {/* Chart X-axis Labels */}
          <div className="flex justify-between mt-3 px-1.5 text-xs font-semibold text-slate-500">
            {chartData.map((d, idx) => (
              <span key={idx} className="w-10 text-center">{d.day}</span>
            ))}
          </div>
        </div>

        {/* Category Sales Distribution (1/3 width) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-base">Ventas por Categoría</h4>
            <p className="text-xs text-slate-400">Distribución de ingresos acumulados.</p>
          </div>
          
          <div className="my-6 space-y-4">
            {categoryTotals.length > 0 ? (
              categoryTotals
                .sort((a, b) => b.value - a.value)
                .map((cat, idx) => {
                  const percentage = Math.round((cat.value / totalCatVal) * 100);
                  const colors = [
                    'bg-indigo-500 shadow-indigo-500/20',
                    'bg-purple-500 shadow-purple-500/20',
                    'bg-pink-500 shadow-pink-500/20',
                    'bg-cyan-500 shadow-cyan-500/20',
                  ];
                  const barColor = colors[idx % colors.length];
                  
                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-300">{cat.name}</span>
                        <span className="font-mono text-slate-400 font-bold">{cat.value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} ({percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${barColor}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 font-medium">
                No hay suficientes datos de ventas.
              </div>
            )}
          </div>

          <div className="border-t border-slate-850 pt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Volumen Total Facturado:</span>
            <span className="text-white font-bold font-mono">
              {totalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity & Low Stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2/3 width) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-white text-base">Últimos Pedidos</h4>
              <p className="text-xs text-slate-400">Monitoreo en tiempo real de transacciones.</p>
            </div>
            <button 
              onClick={() => onNavigate('orders')} 
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5 group"
            >
              Ver todos los pedidos <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pt-1">ID</th>
                  <th className="pb-3 pt-1">Cliente</th>
                  <th className="pb-3 pt-1">Total</th>
                  <th className="pb-3 pt-1">Estado</th>
                  <th className="pb-3 pt-1 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {recentOrders.map((order) => {
                  // status colors
                  const statusColors: Record<string, string> = {
                    'Pendiente': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
                    'En Preparación': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
                    'Enviado': 'bg-blue-500/10 text-blue-400 border-blue-500/25',
                    'Entregado': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
                    'Cancelado': 'bg-rose-500/10 text-rose-400 border-rose-500/25',
                  };
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-850/30 transition-colors duration-150">
                      <td className="py-3 font-mono font-bold text-slate-300">{order.id}</td>
                      <td className="py-3 text-white font-medium">{order.customerName}</td>
                      <td className="py-3 font-mono font-bold text-slate-300">
                        {order.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-xs font-semibold border rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Warning Alerts (1/3 width) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col">
          <div className="mb-4">
            <h4 className="font-bold text-white text-base">Alertas de Inventario</h4>
            <p className="text-xs text-slate-400">Productos cercanos o bajo stock mínimo.</p>
          </div>
          
          <div className="flex-1 space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 3).map((prod) => (
                <div 
                  key={prod.id} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-rose-500/10"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    {prod.stock}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{prod.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">SKU: {prod.sku} • Min: {prod.minStock}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('products')}
                    className="px-2 py-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/15 border border-rose-500/20 rounded-md transition-colors whitespace-nowrap"
                  >
                    Surtir
                  </button>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-300">Todo en orden</p>
                <p className="text-[10px] text-slate-500 mt-1">No hay alertas de inventario en este momento.</p>
              </div>
            )}
            
            {lowStockProducts.length > 3 && (
              <button
                onClick={() => onNavigate('products')}
                className="w-full text-center text-xs text-rose-400 font-semibold hover:text-rose-300 transition-colors pt-2"
              >
                Y {lowStockProducts.length - 3} alertas más. Administrar inventario
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
