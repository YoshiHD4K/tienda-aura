import { Link } from 'react-router-dom';
import '../styles/Hero.css';

export function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <span className="hero-subtitle">Arte & Diseño</span>
                <h1>Elegancia hecha a mano</h1>
                <p>Descubre piezas exclusivas donde el diseño moderno se encuentra con la artesanía tradicional.</p>
                <Link to="/catalogo" className="btn-primary">Ver Catálogo</Link>
            </div>
        </section>
    );
}
