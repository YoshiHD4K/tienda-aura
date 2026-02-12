import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo-container">
                    <img src="/logo.png" alt="MilenaShop Logo" className="logo-img" />
                </Link>

                <div className="mobile-controls">
                    <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                </div>

                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                    <Link to="/catalogo" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
                </nav>

                <div className="header-spacer"></div>
            </div>
        </header>
    );
}

