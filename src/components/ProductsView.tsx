'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Package, AlertTriangle, PlusCircle, MinusCircle, X } from 'lucide-react';
import { Product } from '../types';

interface ProductsViewProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

export default function ProductsView({ products, onUpdateStock, onAddProduct }: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: 'Tecnología',
    price: '',
    stock: '',
    minStock: '',
    imageColor: 'from-blue-500 to-indigo-600',
  });

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Color options for products
  const colorPresets = [
    { label: 'Indigo', value: 'from-indigo-500 to-purple-600' },
    { label: 'Blue', value: 'from-blue-500 to-cyan-500' },
    { label: 'Emerald', value: 'from-emerald-500 to-teal-600' },
    { label: 'Rose', value: 'from-rose-500 to-red-600' },
    { label: 'Amber', value: 'from-amber-500 to-orange-600' },
    { label: 'Fuchsia', value: 'from-violet-500 to-fuchsia-600' },
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleStockAdjust = (prodId: string, currentStock: number, amount: number) => {
    const nextStock = Math.max(0, currentStock + amount);
    onUpdateStock(prodId, nextStock);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, sku, category, price, stock, minStock, imageColor } = newProductForm;
    
    if (!name || !sku || !price || !stock || !minStock) {
      alert('Por favor complete todos los datos.');
      return;
    }

    onAddProduct({
      name,
      sku,
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      minStock: parseInt(minStock) || 0,
      imageColor,
    });

    setNewProductForm({
      name: '',
      sku: '',
      category: 'Tecnología',
      price: '',
      stock: '',
      minStock: '',
      imageColor: 'from-blue-500 to-indigo-600',
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Gestión de Productos</h2>
          <p className="text-sm text-slate-400">Control de inventario, stock y catálogo general.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Producto</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 border border-slate-850 rounded-2xl backdrop-blur-md">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'Todas las Categorías' : cat}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Products Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const isLowStock = prod.stock <= prod.minStock;

            return (
              <div 
                key={prod.id} 
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-md group hover:border-slate-700 transition-all duration-350"
              >
                
                {/* Visual Card Top Block */}
                <div className={`h-24 bg-gradient-to-tr ${prod.imageColor} relative p-4 flex flex-col justify-between`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-black/35 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-bold font-mono tracking-wide uppercase">
                      {prod.category}
                    </span>
                    <span className="text-[10px] bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-slate-300 font-bold font-mono border border-slate-800">
                      {prod.sku}
                    </span>
                  </div>
                  
                  {isLowStock && (
                    <div className="absolute -bottom-3.5 right-4 bg-rose-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-rose-500/20 border border-slate-950">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Stock Crítico</span>
                    </div>
                  )}
                </div>

                {/* Card Details Block */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Pricing and Stock count */}
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Precio Unitario</span>
                      <p className="font-mono text-base font-bold text-white mt-0.5">
                        {prod.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Stock Disponible</span>
                      <p className={`font-mono text-base font-bold mt-0.5 ${isLowStock ? 'text-rose-400' : 'text-slate-350'}`}>
                        {prod.stock}
                      </p>
                    </div>
                  </div>

                  {/* Stock adjuster controls */}
                  <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Ajustar Stock</span>
                    <div className="flex items-center gap-1 bg-slate-950/40 p-1 border border-slate-850 rounded-lg">
                      <button
                        onClick={() => handleStockAdjust(prod.id, prod.stock, -1)}
                        className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-900 transition-colors"
                        title="Restar 1 unidad"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-mono font-bold px-2 text-slate-300">
                        {prod.stock}
                      </span>
                      <button
                        onClick={() => handleStockAdjust(prod.id, prod.stock, 5)}
                        className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-900 transition-colors"
                        title="Sumar 5 unidades"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 text-slate-500 flex flex-col items-center justify-center p-6 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-3">
            <Package className="h-5 w-5 text-slate-600" />
          </div>
          <p className="font-semibold text-slate-400">No se encontraron productos</p>
          <p className="text-xs text-slate-500 mt-1">Intente ajustar los términos de búsqueda o filtros.</p>
        </div>
      )}

      {/* Add Product Modal (Built-in drawer) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          
          <form 
            onSubmit={handleAddProductSubmit}
            className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-300 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-850">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Package className="h-4.5 w-4.5 text-indigo-400" />
                Añadir Nuevo Producto
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
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ratón Ergonómico Pro"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">SKU / Código Único *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: RAT-ERG-005"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Categoría</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                  >
                    <option value="Tecnología">Tecnología</option>
                    <option value="Audio">Audio</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Hogar">Hogar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Precio (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="49.99"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Stock Inicial *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="10"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Stock Mínimo *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="3"
                    value={newProductForm.minStock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, minStock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 mt-1"
                  />
                </div>
              </div>

              {/* Image Color Gradient selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Preset de Visual (Color)</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setNewProductForm({ ...newProductForm, imageColor: preset.value })}
                      className={`p-2 rounded-xl text-2xs font-semibold border flex items-center justify-between text-left cursor-pointer transition-all ${
                        newProductForm.imageColor === preset.value
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-slate-850 bg-slate-950/20 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-tr ${preset.value}`}></span>
                    </button>
                  ))}
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
                Añadir Producto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
