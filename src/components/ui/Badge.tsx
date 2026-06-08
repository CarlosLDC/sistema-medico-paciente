import React from 'react';
import { cn } from '../../lib/utils';
import { getOrderStatusClassName } from '../../lib/statusColors';
import { OrderStatus } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: OrderStatus | string;
  variant?: 'default' | 'primary' | 'secondary';
}

const variantClasses = {
  default: 'bg-surface-800 text-surface-200 border-surface-700',
  primary: 'bg-surface-800 text-surface-200 border-surface-600',
  secondary: 'bg-surface-800 text-white border-secondary/30',
};

export default function Badge({ status, variant = 'default', className, children, ...props }: BadgeProps) {
  const statusClass = status ? getOrderStatusClassName(status) : variantClasses[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap px-2.5 py-0.5 text-xs font-semibold border rounded-full',
        status ? statusClass : variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
