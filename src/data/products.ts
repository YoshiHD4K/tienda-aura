export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: "Set de Acuarelas Artesanales",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400",
        category: "Pintura"
    },
    {
        id: 2,
        name: "Hilo de Algodón Orgánico (Macramé)",
        price: 12.50,
        image: "https://images.unsplash.com/photo-1520699049698-38936082d6b6?auto=format&fit=crop&q=80&w=400",
        category: "Tejido"
    },
    {
        id: 3,
        name: "Kit de Bordado Floral",
        price: 35.00,
        image: "https://images.unsplash.com/photo-1616606869486-137a85d38db6?auto=format&fit=crop&q=80&w=400",
        category: "Bordado"
    },
    {
        id: 4,
        name: "Papel Hecho a Mano con Pétalos",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1524312895240-6d9b50db1f8c?auto=format&fit=crop&q=80&w=400",
        category: "Papelería"
    },
    {
        id: 5,
        name: "Moldes de Silicona para Resina",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1595166687498-8e6730a9058e?auto=format&fit=crop&q=80&w=400",
        category: "Resina"
    },
    {
        id: 6,
        name: "Tijeras Vintage de Cigüeña",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1589369062334-a0d7830f531d?auto=format&fit=crop&q=80&w=400",
        category: "Herramientas"
    }
];
