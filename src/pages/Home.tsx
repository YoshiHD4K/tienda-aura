import { Hero } from '../components/Hero';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { PageTransition, FadeIn } from '../components/Animations';
import '../styles/Home.css';

export function Home() {
  const featuredProducts = products.slice(0, 3); // Top 3 products for display

  return (
    <PageTransition>
      <Hero />
      
      {/* Introduction Section */}
      <FadeIn className="home-intro">
        <h2>Bienvenidos a MilenaShop</h2>
        <p>
          Explora nuestra selección exclusiva de artesanías y diseños únicos creados con pasión. 
          Cada pieza cuenta una historia de tradición y modernidad, diseñada para quienes aprecian lo extraordinario.
        </p>
      </FadeIn>

      {/* Featured Categories */}
      <section className="categories-section">
        <FadeIn>
          <h2 className="section-title">Categorías Destacadas</h2>
        </FadeIn>
        <div className="categories-grid">
          <FadeIn className="category-card" delay={0.1}>
            <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600" alt="Pintura" />
            <div className="category-content">
              <h3>Pintura</h3>
              <span className="category-link">Ver Catálogo</span>
            </div>
          </FadeIn>
          <FadeIn className="category-card" delay={0.2}>
            <img src="https://images.unsplash.com/photo-1520699049698-38936082d6b6?auto=format&fit=crop&q=80&w=600" alt="Textíl" />
            <div className="category-content">
              <h3>Textíl</h3>
              <span className="category-link">Ver Catálogo</span>
            </div>
          </FadeIn>
          <FadeIn className="category-card" delay={0.3}>
            <img src="https://images.unsplash.com/photo-1524312895240-6d9b50db1f8c?auto=format&fit=crop&q=80&w=600" alt="Papelería" />
            <div className="category-content">
              <h3>Papelería</h3>
              <span className="category-link">Ver Catálogo</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <FadeIn>
          <h2 className="section-title">Lo Más Vendido</h2>
          <p className="section-subtitle">Favoritos de nuestros clientes</p>
        </FadeIn>
        
        <div className="featured-grid">
          {featuredProducts.map((product, index) => (
             <FadeIn key={product.id} delay={index * 0.1}>
               <ProductCard product={product} />
             </FadeIn>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}

