import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { PageTransition, FadeIn } from '../components/Animations';
import '../styles/Catalog.css';

export function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [startIndex, setStartIndex] = useState(0);
  
  const ITEMS_PER_VIEW = 4;

  // Obtener categorías únicas dinámicamente
  const categories = useMemo(() => {
    return ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
  }, []);

  // Calcular categorías visibles
  const visibleCategories = categories.slice(startIndex, startIndex + ITEMS_PER_VIEW);
  
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + ITEMS_PER_VIEW < categories.length;

  const handlePrev = () => {
    if (canGoPrev) setStartIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (canGoNext) setStartIndex(prev => prev + 1);
  };

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <PageTransition className="catalog-container" id="productos">
      <div className="catalog-header">
        <h2 className="section-title">Catálogo</h2>
        <p className="section-subtitle">Piezas únicas seleccionadas para ti</p>
      </div>
      
      <FadeIn className="catalog-filters">
        <input 
          type="text" 
          placeholder="Buscar piezas..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="category-nav-wrapper">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="nav-btn" 
            onClick={handlePrev} 
            disabled={!canGoPrev}
            aria-label="Categorías anteriores"
          >
            ‹
          </motion.button>
          
          <div className="category-tabs">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleCategories.map(category => (
                <motion.button 
                  key={category}
                  className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>{category}</span>
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="activeTab"
                      // Use custom CSS class for active background instead of inline style
                      className="category-active-bg-motion"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'var(--color-secondary)',
                        borderRadius: '0px', 
                        zIndex: 0
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }} 
            className="nav-btn" 
            onClick={handleNext} 
            disabled={!canGoNext}
            aria-label="Categorías siguientes"
          >
            ›
          </motion.button>
        </div>
      </FadeIn>
      
      {filteredProducts.length > 0 ? (
        <motion.div 
          className="products-grid"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <FadeIn className="no-results">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </FadeIn>
      )}
    </PageTransition>
  );
}