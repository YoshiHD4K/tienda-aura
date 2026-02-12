import { useState, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../data/products';
import '../styles/ProductModal.css';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        transition: { type: "spring" as const, damping: 25, stiffness: 300 }
    },
    exit: { scale: 0.8, opacity: 0, y: 50 }
};

export function ProductModal({ product, onClose }: ProductModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Check if product has multiple images
    const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400'];
    const hasMultipleImages = images.length > 1;

    // Replace with actual WhatsApp number
    const phoneNumber = "584120183859"; 
    const message = `Hola, estoy interesado en el producto: ${product.name}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const nextImage = (e: MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <motion.div 
            className="product-modal-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
        >
            <motion.div 
                className="product-modal-content"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
                layout // Smooth layout changes when image size changes
            >
                <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">×</button>
                
                <div className="modal-image-container">
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={currentImageIndex}
                            src={images[currentImageIndex]} 
                            alt={`${product.name} - View ${currentImageIndex + 1}`} 
                            className="modal-image"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </AnimatePresence>

                    {hasMultipleImages && (
                        <>
                            <button className="slider-btn prev" onClick={prevImage} aria-label="Imagen anterior">‹</button>
                            <button className="slider-btn next" onClick={nextImage} aria-label="Siguiente imagen">›</button>
                            
                            <div className="slider-dots">
                                {images.map((_, idx) => (
                                    <span 
                                        key={idx} 
                                        className={`slider-dot ${idx === currentImageIndex ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                <div className="modal-details">
                    <h2 className="modal-product-name">{product.name}</h2>
                    <p className="modal-product-category">{product.categories?.name || 'Varios'}</p>
                    
                    {product.description && (
                        <div className="modal-product-description">
                            <p>{product.description}</p>
                        </div>
                    )}
                    
                    <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="whatsapp-btn"
                    >
                    
                        Ir a WhatsApp
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
}
