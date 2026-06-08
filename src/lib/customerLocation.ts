import { Customer } from '../types';

export function formatCustomerLocation(customer: Pick<Customer, 'municipio' | 'state'>) {
  return `${customer.municipio}, ${customer.state}`;
}

export function formatCustomerAddress(customer: Pick<Customer, 'address' | 'municipio' | 'state'>) {
  return `${customer.address} — ${formatCustomerLocation(customer)}`;
}

/** Migra registros antiguos que usaban el campo `city`. */
export function normalizeCustomer(raw: Customer & { city?: string }): Customer {
  return {
    ...raw,
    municipio: raw.municipio ?? raw.city ?? '',
    state: raw.state ?? '',
  };
}
