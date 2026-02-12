// src/components/ProductCard.tsx
import { getMainImage } from '../data/products';
import type { Product } from '../data/products';
import '../styles/ProductCard.css';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const mainImage = getMainImage(product);
    return (
        <div className="product-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className="card-image-wrapper">
                <img src={mainImage} alt={product.name} className="product-image" loading="lazy" />
            </div>
            <div className="product-info">
                <span className="product-category">{product.categories?.name || 'Varios'}</span>
                <h3 className="product-name">{product.name}</h3>
            </div>
        </div>
    );
}
