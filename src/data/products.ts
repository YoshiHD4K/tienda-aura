export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    images?: string[]; // Array of image URLs
    idcategory?: number; // Foreign key
    categories?: Category; // Relation for joined data
    // Deprecated fields kept for backward compatibility if needed, but we should remove them
    // price: number; // Removed
    // category: string; // Removed/Replaced by relation
}

// Helper to get main image safely
export const getMainImage = (product: Product) => {
    return product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400';
};

export const products: Product[] = []; // Empty default, will be fetched from Supabase
