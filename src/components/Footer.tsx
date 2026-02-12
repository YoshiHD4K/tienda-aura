// src/components/Footer.tsx

export function Footer() {
    return (
        <footer style={{ 
            backgroundColor: 'var(--color-surface)', 
            color: 'var(--color-white)', 
            padding: '4rem 2rem', 
            textAlign: 'center',
            marginTop: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <h3 style={{ color: 'var(--color-secondary)', letterSpacing: '2px', marginBottom: '1rem' }}>MILENA SHOP</h3>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '2rem' }}>Manualidades con esencia y elegancia.</p>
            <div style={{ fontSize: '0.8rem', opacity: 0.4 }}>
                &copy; {new Date().getFullYear()} MilenaShop. Todos los derechos reservados.
            </div>
        </footer>
    );
}
