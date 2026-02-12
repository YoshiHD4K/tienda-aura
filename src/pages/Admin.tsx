import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeIn } from '../components/Animations';
import usersData from '../data/users.json';
import type { Product, Category } from '../data/products';
import { getMainImage } from '../data/products';
import { supabase } from '../lib/supabase';
import '../styles/AdminLogin.css';

// Componente para el Dashboard (Panel una vez logueado)
const AdminDashboard = ({ user, onLogout }: { user: typeof usersData[0], onLogout: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Category Management State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  // Image Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    idcategory: number | string;
    description: string;
    existingImages: string[]; // URLs of images already on server
  }>({
    name: '',
    idcategory: '',
    description: '',
    existingImages: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      // Fetch categories first
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');
      
      if (catError) throw catError;
      setCategories(catData || []);

      // Fetch products with category relation
      const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (
                id,
                name
            )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error cargando datos');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      idcategory: product.idcategory || '',
      description: product.description || '',
      existingImages: product.images || []
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error al eliminar');
      }
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      idcategory: categories.length > 0 ? categories[0].id : '',
      description: '',
      existingImages: []
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  // --- Category Logic ---
  const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCategoryName.trim()) return;
      
      try {
          if (editingCategoryId) {
              // Update existing
              const { error } = await supabase
                .from('categories')
                .update({ name: newCategoryName })
                .eq('id', editingCategoryId);
                
              if (error) throw error;
              
              setCategories(prev => prev.map(c => c.id === editingCategoryId ? { ...c, name: newCategoryName } : c));
              setEditingCategoryId(null);
          } else {
              // Create new
              const { data, error } = await supabase.from('categories').insert([{ name: newCategoryName }]).select();
              if (error) throw error;
              if (data) {
                  setCategories(prev => [...prev, data[0]]);
              }
          }
          setNewCategoryName('');
      } catch (error) {
          console.error("Error managing category:", error);
          alert("Error al guardar categoría");
      }
  };

  const handleEditCategory = (category: Category) => {
      setNewCategoryName(category.name);
      setEditingCategoryId(category.id);
  };

  const handleCancelEditCategory = () => {
      setNewCategoryName('');
      setEditingCategoryId(null);
  }

  const handleDeleteCategory = async (id: number) => {
      if (!window.confirm('¿Eliminar categoría? Si tiene productos asociados podría fallar.')) return;
      
      try {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) throw error;
          
          setCategories(prev => prev.filter(c => c.id !== id));
          // If we were editing this one, cancel edit
          if (editingCategoryId === id) {
              handleCancelEditCategory();
          }
      } catch (error) {
          console.error("Error deleting category:", error);
          alert("Error al eliminar categoría (posiblemente tenga productos asociados)");
      }
  };

  // --- Image Logic ---
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    // Convert FileList to Array
    const newFiles = Array.from(e.target.files);
    
    // Check limit (existing + new selected + already selected in this session)
    const totalImages = formData.existingImages.length + selectedFiles.length + newFiles.length;
    if (totalImages > 5) {
        alert("Máximo 5 imágenes permitidas por producto.");
        return;
    }

    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    
    // Clear the input value to allow re-selecting the same file if needed
    e.target.value = '';
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
      setFormData(prev => ({
          ...prev,
          existingImages: prev.existingImages.filter((_, i) => i !== index)
      }));
  };

  const uploadImages = async (): Promise<string[]> => {
      const uploadedUrls: string[] = [];
      
      for (const file of selectedFiles) {
          // Sanitize filename and make it unique
          const fileExt = file.name.split('.').pop();
          const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
          const fileName = `${Date.now()}_${safeName}.${fileExt}`;
          
          try {
              console.log(`Intentando subir: ${fileName} al bucket 'products'`);
              
              const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('products')
                  .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                  });

              if (uploadError) {
                  console.error("Error detallado de subida:", uploadError);
                  throw uploadError;
              }
              
              if (uploadData) {
                   const { data: urlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);
                   
                   console.log("URL generada:", urlData.publicUrl);
                   uploadedUrls.push(urlData.publicUrl);
              }

          } catch (error) {
              console.error("Fallo la subida para", file.name, error);
              alert(`Error al subir la imagen ${file.name}. Verifica que el bucket 'products' exista y sea público.`);
              throw error; // Stop process if upload fails
          }
      }
      return uploadedUrls;
  };

  const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
          
          if (newFiles.length === 0) return;

          const totalImages = formData.existingImages.length + selectedFiles.length + newFiles.length;
          if (totalImages > 5) {
              alert("Máximo 5 imágenes permitidas por producto.");
              return;
          }

          const newPreviews = newFiles.map(file => URL.createObjectURL(file));
          setSelectedFiles(prev => [...prev, ...newFiles]);
          setPreviewUrls(prev => [...prev, ...newPreviews]);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.existingImages.length === 0 && selectedFiles.length === 0) {
        alert("Debes tener al menos una imagen (existente o nueva).");
        return;
    }

    try {
        setIsUploading(true);
        // 1. Upload new files
        const newImageUrls = await uploadImages();
        
        // 2. Combine with existing images
        const finalImages = [...formData.existingImages, ...newImageUrls];

        const productData = {
            name: formData.name,
            idcategory: Number(formData.idcategory),
            description: formData.description,
            images: finalImages
        };

        if (editingProduct) {
            const { error } = await supabase
                .from('products')
                .update(productData)
                .eq('id', editingProduct.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('products')
                .insert([productData]);
            if (error) throw error;
        }

        setIsModalOpen(false);
        fetchData();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error guardando producto');
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <PageTransition>
      <div className="admin-dashboard-container">
        <header className="dashboard-header">
          <div>
            <h2 className="section-title" style={{ margin: 0, fontSize: '1.8rem' }}>Panel de Administración</h2>
            <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>Bienvenido, {user.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => setIsCategoryModalOpen(true)} className="login-btn" style={{ margin:0, width:'auto', padding:'0.6rem 1rem', fontSize:'0.9rem', background:'rgba(212, 175, 55, 0.2)' }}>
                Categorías
            </button>
            <button onClick={handleAddNew} className="btn-add">
              <span>+ Nuevo Producto</span>
            </button>
            <button 
                onClick={onLogout} 
                className="login-btn" 
                style={{ margin: 0, width: 'auto', padding: '0.6rem 1.5rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)' }}
            >
                Salir
            </button>
          </div>
        </header>
        
        {loading ? <p style={{color:'white', textAlign:'center'}}>Cargando productos...</p> : (
        <div className="products-grid">
          {products.map(product => (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={product.id} 
              className="product-card-admin"
            >
              <img src={getMainImage(product)} alt={product.name} className="product-image-admin" />
              <div className="product-info-admin">
                <h3 className="product-name-admin">{product.name}</h3>
                <span className="product-category-admin">
                    {product.categories?.name || 'Sin categoría'}
                </span>
                
                <div className="admin-actions">
                  <button onClick={() => handleEdit(product)} className="action-btn btn-edit">Editar</button>
                  <button onClick={() => handleDelete(product.id)} className="action-btn btn-delete">Eliminar</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Loading Modal */}
        <AnimatePresence>
            {isUploading && (
                <div className="modal-overlay" style={{ zIndex: 2000 }}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="loading-container"
                    >
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Subiendo imágenes y guardando...</p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Product Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="modal-overlay">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modal-content"
              >
                <div className="modal-header">
                    <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
                </div>
                
                <div className="modal-body">
                    <form id="productForm" onSubmit={handleSubmit} className="form-grid">
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Nombre</label>
                                <input 
                                className="form-input" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Categoría</label>
                                <select 
                                    className="form-input"
                                    value={formData.idcategory}
                                    onChange={e => setFormData({...formData, idcategory: e.target.value})}
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Imágenes (Máx 5)</label>
                            
                            <div className="image-preview-grid">
                                {/* Existing Images */}
                                {formData.existingImages.map((img, idx) => (
                                    <div key={`existing-${idx}`} className="image-preview-item">
                                        <img src={img} alt="preview" />
                                        <button 
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeExistingImage(idx)}
                                        >&times;</button>
                                        <span className="image-status-badge badge-saved">Guardada</span>
                                    </div>
                                ))}
                                
                                {/* New Files Preview */}
                                {previewUrls.map((url, idx) => (
                                    <div key={`new-${idx}`} className="image-preview-item">
                                        <img src={url} alt="preview" />
                                        <button 
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeSelectedFile(idx)}
                                        >&times;</button>
                                        <span className="image-status-badge badge-new">Nueva</span>
                                    </div>
                                ))}
                            </div>

                            <label 
                                className={`file-upload-label ${isDragOver ? 'active-drag' : ''}`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    multiple
                                    className="hidden-input"
                                    onChange={handleFileSelect}
                                    disabled={isUploading}
                                />
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <span className="file-upload-text">
                                    {isDragOver ? 'Suelta las imágenes aquí' : 'Arrastra imágenes o haz clic para seleccionar'}
                                </span>
                                <span className="file-upload-hint">
                                    (Máximo 5 imágenes en total)
                                </span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descripción</label>
                            <textarea 
                            className="form-input" 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            rows={4}
                            />
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="action-btn"
                      style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', width: 'auto', padding: '0.6rem 1.5rem' }}
                      disabled={isUploading}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      form="productForm"
                      className="btn-add"
                      style={{ margin: 0 }}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Subiendo...' : (editingProduct ? 'Guardar Cambios' : 'Crear Producto')}
                    </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Category Modal */}
        <AnimatePresence>
            {isCategoryModalOpen && (
                <div className="modal-overlay">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="modal-content"
                        style={{ maxWidth: '500px' }}
                    >
                        <div className="modal-header">
                            <h3>Gestionar Categorías</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="modal-close-btn">&times;</button>
                        </div>
                        
                        <div className="modal-body">
                            <form onSubmit={handleAddCategory} className="form-group" style={{ marginBottom: '2rem' }}>
                                <label className="form-label">
                                    {editingCategoryId ? 'Editar Categoría' : 'Nueva Categoría'}
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        className="form-input" 
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        placeholder="Nombre..."
                                        required
                                    />
                                    <button type="submit" className="btn-add" style={{ margin: 0, whiteSpace: 'nowrap' }}>
                                        {editingCategoryId ? 'Actualizar' : 'Añadir'}
                                    </button>
                                    {editingCategoryId && (
                                        <button 
                                            type="button" 
                                            onClick={handleCancelEditCategory}
                                            className="action-btn"
                                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', width: 'auto' }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>Categorías Existentes</h4>
                                <div style={{ 
                                    maxHeight: '300px', 
                                    overflowY: 'auto', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '0.5rem' 
                                }}>
                                    {categories.map(cat => (
                                        <div key={cat.id} style={{ 
                                            padding: '0.8rem', 
                                            background: 'rgba(255,255,255,0.03)', 
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ color: '#eee' }}>{cat.name}</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    onClick={() => handleEditCategory(cat)}
                                                    className="action-btn btn-edit"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="action-btn btn-delete"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {categories.length === 0 && (
                                        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No hay categorías registradas.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Inicializar estado con localStorage para persistencia
  const [currentUser, setCurrentUser] = useState<typeof usersData[0] | null>(() => {
    const savedUser = localStorage.getItem('adminUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const foundUser = usersData.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('adminUser', JSON.stringify(foundUser)); // Guardar sesión
    } else {
        alert("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adminUser'); // Limpiar sesión
    setUsername('');
    setPassword('');
  };

  // Si hay usuario logueado, mostrar el Dashboard
  if (currentUser) {
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // Si no, mostrar el Login
  return (
    <PageTransition>
      <div className="admin-login-container">
        <FadeIn className="login-card">
          <div className="login-header">
            <div className="admin-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            <h2 className="login-title">Acceso Admin</h2>
            <p className="login-subtitle">Ingresa tus credenciales para gestionar la tienda</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Usuario</label>
              <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    id="username"
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. admin"
                    required
                  />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="login-btn"
            >
              Iniciar Sesión
            </motion.button>
          </form>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
