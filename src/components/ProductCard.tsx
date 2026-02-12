// src/components/ProductCard.tsx
import type { Product } from '../data/products';
import '../styles/ProductCard.css';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="product-card">
            <div className="card-image-wrapper">
                <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
            </div>
        </div>
    );
}
