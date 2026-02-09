import type { Product } from '@/types/home';

export function formatPrice(product: Product): string {
    return new Intl.NumberFormat(product.currency === 'COP' ? 'es-CO' : 'en-US', {
        style: 'currency',
        currency: product.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(product.price);
}
