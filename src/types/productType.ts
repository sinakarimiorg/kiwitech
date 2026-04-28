export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
}

export interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
}