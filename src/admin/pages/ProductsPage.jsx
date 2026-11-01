import React, { useState, useMemo } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

// Helper to rotate an image via client-side canvas
function rotateImageSrc(src, degrees = 90) {
  return new Promise((resolve, reject) => {
    if (!src) return reject(new Error('No image source'));
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;

        const swap = degrees === 90 || degrees === 270;
        let targetWidth = swap ? naturalHeight : naturalWidth;
        let targetHeight = swap ? naturalWidth : naturalHeight;

        // Scale down very large camera images to max 1600px to maintain crisp clarity without overflowing localStorage
        const maxDim = 1600;
        if (Math.max(targetWidth, targetHeight) > maxDim) {
          const scale = maxDim / Math.max(targetWidth, targetHeight);
          targetWidth = Math.round(targetWidth * scale);
          targetHeight = Math.round(targetHeight * scale);
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(
          img,
          -(swap ? targetHeight : targetWidth) / 2,
          -(swap ? targetWidth : targetHeight) / 2,
          swap ? targetHeight : targetWidth,
          swap ? targetWidth : targetHeight
        );

        const rotatedData = canvas.toDataURL('image/jpeg', 0.88);
        resolve(rotatedData);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for rotation'));
    img.src = src;
  });
}

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, bulkDeleteProducts } = useAdminData();
  const showToast = useAdminToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedIds, setSelectedIds] = useState([]);
  const [rotatingIdx, setRotatingIdx] = useState(null);
  const [rotatingProductId, setRotatingProductId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'Wedding Invitations',
    categoryId: 'cat-1',
    price: 'Price on Request',
    salePrice: '',
    stock: 50,
    status: 'Active',
    featured: false,
    isNew: false,
    description: '',
    shortDescription: '',
    images: [],
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: `TPS-P-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.name || 'Wedding Invitations',
      categoryId: categories[0]?.id || 'cat-1',
      price: 'Price on Request',
      salePrice: '',
      stock: 50,
      status: 'Active',
      featured: false,
      isNew: true,
      description: '',
      shortDescription: '',
      images: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      slug: p.slug || '',
      sku: p.sku || '',
      category: p.category || categories[0]?.name || 'Wedding Invitations',
      categoryId: p.categoryId || categories[0]?.id || 'cat-1',
      price: p.price || 'Price on Request',
      salePrice: p.salePrice || '',
      stock: p.stock ?? 50,
      status: p.status || 'Active',
      featured: !!p.featured,
      isNew: !!p.isNew,
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      images: Array.isArray(p.images) ? [...p.images] : [],
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = (p) => {
    const dup = {
      ...p,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now()}`,
      sku: `${p.sku || 'TPS'}-COPY`,
    };
    addProduct(dup);
    showToast('Product duplicated');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast('Product deleted');
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected products?`)) {
      bulkDeleteProducts(selectedIds);
      setSelectedIds([]);
      showToast(`${selectedIds.length} products deleted`);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please provide a product name.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      showToast('Product updated successfully');
    } else {
      addProduct(formData);
      showToast('Product added successfully');
    }

    setIsModalOpen(false);
  };

  // Image Manager helpers inside form
  const addImageUrl = () => {
    const url = window.prompt('Enter image URL or local path (e.g. /wedding-invites/design-1/01.jpg):');
    if (url && url.trim()) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, url.trim()] }));
    }
  };

  const removeImage = (idx) => {
    if (window.confirm('Remove this image?')) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== idx),
      }));
    }
  };

  const moveImage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= formData.images.length) return;
    const reordered = [...formData.images];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setFormData((prev) => ({ ...prev, images: reordered }));
  };

  const replaceImage = (idx) => {
    const newUrl = window.prompt('Enter new image URL/path to replace this image:', formData.images[idx]);
    if (newUrl && newUrl.trim()) {
      const reordered = [...formData.images];
      reordered[idx] = newUrl.trim();
      setFormData((prev) => ({ ...prev, images: reordered }));
    }
  };

  const rotateImage = async (idx) => {
    const src = formData.images[idx];
    if (!src) return;
    setRotatingIdx(idx);
    try {
      const rotated = await rotateImageSrc(src, 90);
      const reordered = [...formData.images];
      reordered[idx] = rotated;
      setFormData((prev) => ({ ...prev, images: reordered }));
      showToast(`Image #${idx + 1} rotated 90° clockwise`);
    } catch (err) {
      console.error('Failed to rotate image:', err);
      alert('Could not rotate image. Please ensure the image is accessible.');
    } finally {
      setRotatingIdx(null);
    }
  };

  const rotateProductCover = async (p) => {
    const images = p.images && p.images.length > 0 ? [...p.images] : (p.image ? [p.image] : []);
    if (images.length === 0) {
      alert('No images to rotate for this product.');
      return;
    }
    setRotatingProductId(p.id);
    try {
      const rotated = await rotateImageSrc(images[0], 90);
      images[0] = rotated;
      updateProduct(p.id, { images, image: rotated });
      showToast(`Rotated cover photo for "${p.sku || p.name}"`);
    } catch (err) {
      console.error('Failed to rotate cover image:', err);
      alert('Could not rotate cover photo.');
    } finally {
      setRotatingProductId(null);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Products ({filteredProducts.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Manage your entire catalog, reorder suite imagery, and adjust inventory.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          + Add New Product
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flex: 1, minWidth: '280px', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search by name, SKU (e.g. TPS-WI-01)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ flex: 1 }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-select"
              style={{ width: '180px' }}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="admin-select"
              style={{ width: '140px' }}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {selectedIds.length > 0 && (
              <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger" style={{ fontSize: '13px' }}>
                Delete Selected ({selectedIds.length})
              </button>
            )}

            <div style={{ display: 'flex', border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 12px',
                  background: viewMode === 'table' ? 'var(--admin-brand-light)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: viewMode === 'table' ? 'var(--admin-brand)' : 'var(--admin-muted)',
                }}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  background: viewMode === 'grid' ? 'var(--admin-brand-light)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: viewMode === 'grid' ? 'var(--admin-brand)' : 'var(--admin-muted)',
                }}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredProducts.map((p) => p.id));
                        else setSelectedIds([]);
                      }}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                  </th>
                  <th>Image</th>
                  <th>Name & SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const cover = p.images?.[0] || '/wedding-invites/cover.jpg';
                  return (
                    <tr key={p.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, p.id]);
                            else setSelectedIds(selectedIds.filter((id) => id !== p.id));
                          }}
                          style={{ accentColor: 'var(--admin-brand)' }}
                        />
                      </td>
                      <td>
                        <img
                          src={cover}
                          alt={p.name}
                          style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--admin-ink)', fontSize: '14px' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{p.sku} • {p.images?.length || 0} photos</div>
                      </td>
                      <td><span className="admin-badge admin-badge-brand">{p.category}</span></td>
                      <td style={{ fontWeight: '600' }}>{p.price}</td>
                      <td>
                        <span style={{ color: p.stock < 10 ? 'var(--admin-danger)' : 'var(--admin-success)', fontWeight: '600' }}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${p.status === 'Active' ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => rotateProductCover(p)}
                            disabled={rotatingProductId === p.id}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            title="Rotate cover photo 90° clockwise"
                          >
                            {rotatingProductId === p.id ? '⏳' : '⟳'}
                          </button>
                          <button onClick={() => openEditModal(p)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDuplicate(p)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} title="Duplicate">
                            📑
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} title="Delete">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {filteredProducts.map((p) => {
            const cover = p.images?.[0] || '/wedding-invites/cover.jpg';
            return (
              <div key={p.id} className="admin-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '260px' }}>
                  <img src={cover} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="admin-badge admin-badge-brand" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    {p.sku}
                  </span>
                  <span className={`admin-badge ${p.status === 'Active' ? 'admin-badge-success' : 'admin-badge-neutral'}`} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: 'var(--admin-ink)' }}>{p.name}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{p.images?.length || 0} suite images</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--admin-brand)', marginTop: '8px' }}>{p.price}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => openEditModal(p)} className="admin-btn admin-btn-secondary" style={{ flex: 1, padding: '6px' }}>Edit</button>
                    <button
                      onClick={() => rotateProductCover(p)}
                      disabled={rotatingProductId === p.id}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      title="Rotate cover photo 90° clockwise"
                    >
                      {rotatingProductId === p.id ? '⏳' : '⟳'}
                    </button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="admin-btn admin-btn-danger" style={{ padding: '6px 10px' }}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '780px' }}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                {editingProduct ? `Edit Product: ${editingProduct.sku}` : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {/* General Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Product Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">SKU / Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Category</label>
                    <select
                      className="admin-select"
                      value={formData.category}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.name === e.target.value);
                        setFormData({ ...formData, category: e.target.value, categoryId: cat?.id || '' });
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Price</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Stock Quantity</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* IMAGE MANAGER (Core Requirement) */}
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Product Images ({formData.images.length})</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                        First image is automatically used as the <strong>Cover Badge</strong> photo on the website. Use arrows to reorder, or <strong>⟳ 90°</strong> to rotate any photo.
                      </p>
                    </div>
                    <button type="button" onClick={addImageUrl} className="admin-btn admin-btn-secondary" style={{ fontSize: '12px' }}>
                      + Add Image Path
                    </button>
                  </div>

                  {/* Images Thumbnails Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        style={{
                          borderRadius: '8px',
                          border: idx === 0 ? '2px solid var(--admin-brand)' : '1px solid var(--admin-border)',
                          overflow: 'hidden',
                          backgroundColor: '#FAFAF9',
                          position: 'relative'
                        }}
                      >
                        <div style={{ position: 'relative', height: '140px' }}>
                          <img src={imgUrl} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <span className="admin-badge admin-badge-brand" style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '10px', padding: '2px 6px' }}>
                              ★ Cover
                            </span>
                          )}
                          <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '1px 5px', borderRadius: '4px' }}>
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Image Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', background: '#fff', borderTop: '1px solid var(--admin-border)' }}>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, idx - 1)}
                            disabled={idx === 0}
                            style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1, padding: '2px 4px' }}
                            title="Move left (set earlier)"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={() => rotateImage(idx)}
                            disabled={rotatingIdx === idx}
                            style={{
                              border: '1px solid #E5E7EB',
                              borderRadius: '4px',
                              background: '#F9FAFB',
                              cursor: rotatingIdx === idx ? 'wait' : 'pointer',
                              fontSize: '11px',
                              padding: '2px 5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                              color: 'var(--admin-brand)',
                              fontWeight: '600'
                            }}
                            title="Rotate 90° clockwise"
                          >
                            {rotatingIdx === idx ? '⏳' : '⟳ 90°'}
                          </button>
                          <button
                            type="button"
                            onClick={() => replaceImage(idx)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}
                            title="Replace URL"
                          >
                            🔄
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, idx + 1)}
                            disabled={idx === formData.images.length - 1}
                            style={{ border: 'none', background: 'none', cursor: idx === formData.images.length - 1 ? 'default' : 'pointer', opacity: idx === formData.images.length - 1 ? 0.3 : 1, padding: '2px 4px' }}
                            title="Move right (set later)"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-danger)', padding: '2px 4px' }}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '24px', marginTop: '20px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    Featured Collection
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    New Arrival
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.status === 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Draft' })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    Active Status (Visible on site)
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

