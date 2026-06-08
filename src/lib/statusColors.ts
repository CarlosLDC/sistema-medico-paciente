import { OrderStatus } from '../types';

export const orderStatusColors: Record<OrderStatus, string> = {
  Pendiente: 'bg-surface-800 text-surface-200 border-surface-700',
  'En Preparación': 'bg-surface-800 text-white border-surface-600',
  Enviado: 'bg-surface-800 text-surface-200 border-surface-600',
  Entregado: 'bg-surface-800 text-white border-secondary/30',
  Cancelado: 'bg-surface-800 text-surface-400 border-surface-700',
};

export function getOrderStatusClassName(status: OrderStatus | string): string {
  return orderStatusColors[status as OrderStatus] ?? 'bg-surface-800 text-surface-300 border-surface-700';
}
