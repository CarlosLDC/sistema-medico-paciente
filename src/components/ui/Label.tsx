import React from 'react';
import { cn } from '../../lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn('zenith-field-label', className)}
      {...props}
    >
      {children}
    </label>
  );
}
