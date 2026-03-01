export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    currency: 'COP' | 'USD';
    primaryImage: string;
    secondaryImage?: string | null;
    isNew?: boolean;
}

export interface Collection {
    id: number;
    name: string;
    slug: string;
    coverImage: string;
    description?: string;
    featured?: boolean;
}

export interface WelcomeProps {
    featuredProducts?: Product[];
    collections?: Collection[];
    faqItems?: { question: string; answer: string }[];
}
