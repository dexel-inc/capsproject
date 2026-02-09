export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    price: number;
    currency: 'COP' | 'USD';
    description: string;
    images: string[];
    primaryImage: string | null;
    isNew?: boolean;
}
