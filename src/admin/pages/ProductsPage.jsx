import React, { useState, useMemo, useRef } from 'react';
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
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    syncCatalogProducts,
    exportAllData,
    importAllData,
  } = useAdminData();
  const showToast = useAdminToast();

  const fileInputRef = useRef(null);
  const [modalTab, setModalTab] = useState('edit'); // 'edit' | 'preview'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedIds, setSelectedIds] = useState([]);
  const [rotatingIdx, setRotatingIdx] = useState(null);
  const [rotatingProductId, setRotatingProductId] = useState(null);
  const [copiedSku, setCopiedSku] = useState(null);

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (importAllData) {
          await importAllData(json);
          showToast('Successfully restored backup catalog across all devices! ✓', 'success');
        }
      } catch (err) {
        showToast('Failed to import backup: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const copyProductDirectLink = (p) => {
    const code = p.sku || p.code || p.id;
    const link = `https://www.thepaperstory.store/product/${encodeURIComponent(code)}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link);
    }
    setCopiedSku(p.id);
    showToast(`Copied direct link for ${p.sku || p.name}!`, 'success');
    setTimeout(() => setCopiedSku(null), 2000);
  };

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
    minQuantity: 25,
    cardSize: '5 × 7 inches',
    cardStock: '9K Textured Card (300–360 GSM)',
    envelopeStock: 'Art Card (300–380 GSM)',
    printTechnique: 'Digital Printing',
    productionTime: '20–30 working days',
    status: 'Active',
    featured: false,
    isNew: false,
    description: '',
    shortDescription: '',
    instagramUrl: '',
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
    setModalTab('edit');
    setFormData({
      name: '',
      slug: '',
      sku: `TPS-P-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.name || 'Wedding Invitations',
      categoryId: categories[0]?.id || 'cat-1',
      price: 'Price on Request',
      salePrice: '',
      stock: 50,
      minQuantity: 25,
      cardSize: '5 × 7 inches',
      cardStock: '9K Textured Card (300–360 GSM)',
      envelopeStock: 'Art Card (300–380 GSM)',
      printTechnique: 'Digital Printing',
      productionTime: '20–30 working days',
      status: 'Active',
      featured: false,
      isNew: true,
      description: '',
      shortDescription: '',
      instagramUrl: '',
      images: [],
      specifications: [
        { label: 'Card Size', value: '5 × 7 inches' },
        { label: 'Invitation Card / Material', value: '9K Textured Card (300–360 GSM)' },
        { label: 'Envelope Stock', value: 'Art Card (300–380 GSM)' },
        { label: 'Printing Technique', value: 'Digital Printing' },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setModalTab('edit');
    const initialSpecs = Array.isArray(p.specifications) && p.specifications.length > 0
      ? p.specifications.map((s) => ({ label: s.label || '', value: s.value || '' }))
      : [
          p.cardSize ? { label: 'Card Size', value: p.cardSize } : null,
          p.cardStock ? { label: 'Invitation Card / Material', value: p.cardStock } : null,
          p.envelopeStock ? { label: 'Envelope Stock', value: p.envelopeStock } : null,
          p.printTechnique ? { label: 'Printing Technique', value: p.printTechnique } : null,
        ].filter(Boolean);

    setFormData({
      name: p.name || '',
      slug: p.slug || '',
      sku: p.sku || p.code || '',
      category: p.category || categories[0]?.name || 'Wedding Invitations',
      categoryId: p.categoryId || categories[0]?.id || 'cat-1',
      price: p.price || 'Price on Request',
      salePrice: p.salePrice || '',
      stock: p.stock ?? 50,
      minQuantity: p.minQuantity || 25,
      cardSize: p.cardSize || '5 × 7 inches',
      cardStock: p.cardStock || '9K Textured Card (300–360 GSM)',
      envelopeStock: p.envelopeStock || 'Art Card (300–380 GSM)',
      printTechnique: p.printTechnique || 'Digital Printing',
      productionTime: p.productionTime || '20–30 working days',
      status: p.status || 'Active',
      featured: !!p.featured,
      isNew: !!p.isNew,
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      instagramUrl: p.instagramUrl || '',
      images: Array.isArray(p.images) ? [...p.images] : [],
      specifications: initialSpecs.length > 0 ? initialSpecs : [
        { label: 'Card Size', value: '5 × 7 inches' },
        { label: 'Invitation Card / Material', value: '9K Textured Card (300–360 GSM)' },
        { label: 'Envelope Stock', value: 'Art Card (300–380 GSM)' },
        { label: 'Printing Technique', value: 'Digital Printing' },
      ],
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

    const specs = Array.isArray(formData.specifications) ? formData.specifications : [];
    const sizeSpec = specs.find((s) => /size/i.test(s.label));
    const cardSpec = specs.find((s) => /card|material/i.test(s.label));
    const envSpec = specs.find((s) => /envelope/i.test(s.label));
    const printSpec = specs.find((s) => /print/i.test(s.label));

    const payload = {
      ...formData,
      cardSize: sizeSpec ? sizeSpec.value : '',
      cardStock: cardSpec ? cardSpec.value : '',
      envelopeStock: envSpec ? envSpec.value : '',
      printTechnique: printSpec ? printSpec.value : '',
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast('Product updated successfully');
    } else {
      addProduct(payload);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Products ({filteredProducts.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Manage your entire catalog, reorder suite imagery, and adjust inventory.
          </p>
        </div>

        <div className="admin-page-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {exportAllData && (
            <button
              type="button"
              onClick={exportAllData}
              className="admin-btn admin-btn-secondary"
              title="Download backup file of all 228 products with descriptions and specifications"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              📥 Backup JSON
            </button>
          )}
          {importAllData && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".json,application/json"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="admin-btn admin-btn-secondary"
                title="Restore products from a previously saved JSON backup"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                📤 Restore Backup
              </button>
            </>
          )}
          {syncCatalogProducts && (
            <button
              onClick={() => {
                syncCatalogProducts();
                showToast('Synced all catalog products, add-ons and imagery with codebase! ✓');
              }}
              className="admin-btn admin-btn-outline"
              title="Refresh all catalog products, photos, videos and categories from the latest website code"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              ↻ Sync from Catalog
            </button>
          )}
          <button onClick={openAddModal} className="admin-btn admin-btn-primary">
            + Add New Product
          </button>
        </div>
      </div>

      {/* Category Quick-Filter Chips */}
      <div
        className="admin-chips-scroll"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: '10px',
          marginBottom: '14px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '5px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            border: selectedCategory === 'all' ? '1px solid var(--admin-brand)' : '1px solid var(--admin-border)',
            background: selectedCategory === 'all' ? 'var(--admin-brand)' : '#fff',
            color: selectedCategory === 'all' ? '#fff' : 'var(--admin-ink)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          All ({products.length})
        </button>
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.name || p.categorySlug === c.slug).length;
          const isActive = selectedCategory === c.name;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.name)}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                border: isActive ? '1px solid var(--admin-brand)' : '1px solid var(--admin-border)',
                background: isActive ? 'var(--admin-brand)' : '#fff',
                color: isActive ? '#fff' : 'var(--admin-ink)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="admin-filter-inputs" style={{ display: 'flex', flex: 1, minWidth: '260px', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by name, SKU (e.g. TPS-WI-01)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ flex: '1 1 200px' }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-select"
              style={{ flex: '0 1 180px', minWidth: '140px' }}
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
              style={{ flex: '0 1 140px', minWidth: '120px' }}
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
                        <div style={{ fontWeight: '600', color: 'var(--admin-ink)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{p.name}</span>
                          {p.instagramUrl && (
                            <span
                              title="Instagram Reel Linked"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '10px',
                                background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
                                color: '#fff',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                              }}
                            >
                              📸 Reel
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{p.sku} • {p.images?.length || 0} photos</div>
                      </td>
                      <td><span className="admin-badge admin-badge-brand">{p.category}</span></td>
                      <td style={{ fontWeight: '600' }}>{p.price}</td>
                      <td>
                        <span className={`admin-badge ${p.status === 'Active' ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => copyProductDirectLink(p)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            title="Copy direct product link to send to clients"
                          >
                            {copiedSku === p.id ? '✓ Copied' : '🔗 Link'}
                          </button>
                          <a
                            href={`/product/${encodeURIComponent(p.sku || p.code || p.id)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '12px', textDecoration: 'none' }}
                            title="Open live design page"
                          >
                            👁️
                          </a>
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
                  {p.sku && !String(p.sku).toUpperCase().startsWith('TPS-ACC') && (
                    <span className="admin-badge admin-badge-brand" style={{ position: 'absolute', top: '10px', left: '10px', whiteSpace: 'nowrap' }}>
                      {p.sku}
                    </span>
                  )}
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
                  <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => openEditModal(p)} className="admin-btn admin-btn-secondary" style={{ flex: 1, padding: '6px' }}>Edit</button>
                    <button
                      onClick={() => copyProductDirectLink(p)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      title="Copy direct design link"
                    >
                      {copiedSku === p.id ? '✓' : '🔗'}
                    </button>
                    <a
                      href={`/product/${encodeURIComponent(p.sku || p.code || p.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '13px', textDecoration: 'none' }}
                      title="Open live design page"
                    >
                      👁️
                    </a>
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

            <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--admin-border)', padding: '0 20px', background: '#FAFAFA' }}>
              <button
                type="button"
                onClick={() => setModalTab('edit')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: modalTab === 'edit' ? '2px solid var(--admin-brand)' : '2px solid transparent',
                  color: modalTab === 'edit' ? 'var(--admin-brand)' : 'var(--admin-muted)',
                }}
              >
                ✏️ Edit Details & Specifications
              </button>
              <button
                type="button"
                onClick={() => setModalTab('preview')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: modalTab === 'preview' ? '2px solid var(--admin-brand)' : '2px solid transparent',
                  color: modalTab === 'preview' ? 'var(--admin-brand)' : 'var(--admin-muted)',
                }}
              >
                👁️ Live Storefront Preview
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {modalTab === 'preview' ? (
                  <div style={{ background: '#FAF7F2', padding: '24px', borderRadius: '12px', border: '1px solid rgba(107,29,47,0.15)' }}>
                    <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--admin-brand)', background: 'rgba(107,29,47,0.08)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'monospace' }}>
                        Design #{formData.sku || 'TPS-XX'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>• {formData.category}</span>
                    </div>

                    <h2 style={{ fontFamily: 'serif', fontSize: '22px', color: '#2B1B1F', margin: '0 0 16px 0' }}>
                      {formData.name || 'Untitled Design'}
                    </h2>

                    <div style={{ borderTop: '1px solid rgba(107,29,47,0.12)', paddingTop: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-brand)', marginBottom: '6px', fontFamily: 'serif' }}>
                        About This Design
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(43,27,31,0.85)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {formData.description || 'No description provided yet.'}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(107,29,47,0.12)', paddingTop: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-brand)', marginBottom: '8px', fontFamily: 'serif' }}>
                        Product Details
                      </div>
                      <div style={{ background: '#F5ECE8', padding: '12px 14px', borderRadius: '8px', fontSize: '12px', color: '#2B1B1F', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(Array.isArray(formData.specifications) ? formData.specifications : []).filter(s => s.label && s.value).map((s, idx) => (
                          <div key={idx}><strong>{s.label}:</strong> {s.value}</div>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(107,29,47,0.12)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-brand)', marginBottom: '6px', fontFamily: 'serif' }}>
                        Production &amp; Shipping
                      </div>
                      <div style={{ background: '#F5ECE8', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#2B1B1F', lineHeight: '1.5' }}>
                        <div><strong>Standard Production:</strong> {formData.productionTime || '20–30 working days'}</div>
                        <div style={{ marginTop: '4px' }}><strong>Shipping Charges:</strong> Calculated separately based on weight, location and courier method.</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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

                <div className="admin-form-row-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                    <label className="admin-label">Minimum Order Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="admin-input"
                      placeholder="25"
                      value={formData.minQuantity || 25}
                      onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value, 10) || 25 })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="admin-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>Description &amp; Specifications</label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          description: `## ABOUT THIS DESIGN

This invitation takes inspiration from Mughal art, featuring peacocks, floral details, and traditional patterns. The pink, green, and maroon colours create a rich and elegant look, while the illustrated borders and matching envelope bring the entire design together.

Perfect for couples who want a wedding invitation with a touch of Mughal heritage.

## PRODUCT DETAILS

- **Card Size:** 5 × 7 inches
- **Invitation Card:** 9K Textured Card (300–360 GSM)
- **Envelope:** Art Card (300–380 GSM)
- **Printing Technique:** Digital Printing

## PRODUCTION & DELIVERY

**Standard Production Time:** 20–30 working days

If you need your order earlier, please contact us before placing it. We may be able to accommodate urgent orders depending on our production schedule.

**Please Note:** Production time does not include courier transit time. Delivery time will depend on your location and the selected shipping method.

## SHIPPING & DELIVERY CHARGES

Shipping charges are calculated separately and added to your order total at checkout.

Shipping costs depend on:

- Package weight
- Delivery location
- Selected shipping method

**International Orders:** Customs duties or import taxes may apply. These charges, where applicable, are the responsibility of the customer.

## PREMIUM ADD-ONS

Personalise your invitation with additional finishes and decorative details, including:

- Foiling
- Embossing
- Ribbons
- Envelope liners
- Other embellishments

**Note:** Available customisation options may vary depending on the design.`
                        }));
                        showToast('Standard description template inserted!');
                      }}
                      className="admin-btn admin-btn-outline"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      Insert Standard Template
                    </button>
                  </div>
                  <textarea
                    rows="8"
                    className="admin-textarea"
                    placeholder="Enter design details, paper quality, card size, print techniques..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ fontFamily: 'inherit', lineHeight: '1.5' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                    Line breaks and paragraphs will be displayed on the product page exactly as formatted here.
                  </span>
                </div>

                {/* Structured Specifications Grid */}
                <div style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--admin-ink)' }}>
                        Product Specifications
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--admin-muted)' }}>
                        Add, edit, or remove headings (Card Size, Material, Envelope Stock, etc.) displayed on the product page.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = Array.isArray(formData.specifications) ? formData.specifications : [];
                        setFormData({
                          ...formData,
                          specifications: [...current, { label: '', value: '' }],
                        });
                      }}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', height: 'auto', whiteSpace: 'nowrap' }}
                    >
                      + Add Heading
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {(Array.isArray(formData.specifications) ? formData.specifications : []).map((spec, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1.8fr auto',
                          gap: '8px',
                          alignItems: 'center',
                          background: '#fff',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--admin-border)',
                        }}
                      >
                        <div>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="Heading (e.g. Card Size)"
                            value={spec.label || ''}
                            onChange={(e) => {
                              const updated = [...formData.specifications];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setFormData({ ...formData, specifications: updated });
                            }}
                            style={{ fontSize: '12px', padding: '6px 8px' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="Value (e.g. 5 × 7 inches)"
                            value={spec.value || ''}
                            onChange={(e) => {
                              const updated = [...formData.specifications];
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              setFormData({ ...formData, specifications: updated });
                            }}
                            style={{ fontSize: '12px', padding: '6px 8px' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.specifications.filter((_, i) => i !== idx);
                            setFormData({ ...formData, specifications: updated });
                          }}
                          title="Remove this heading"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#e11d48',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            lineHeight: 1,
                            padding: '4px 6px',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(!formData.specifications || formData.specifications.length === 0) && (
                      <p style={{ margin: '6px 0', fontSize: '11px', color: 'var(--admin-muted)', fontStyle: 'italic' }}>
                        No specifications added. Click "+ Add Heading" to add specification rows.
                      </p>
                    )}
                  </div>
                </div>

                {/* Instagram Reel URL */}
                <div className="admin-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>
                      Instagram Reel URL <span style={{ fontWeight: 'normal', color: 'var(--admin-muted)' }}>(Optional)</span>
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                      Displays "Watch on Instagram" button on design
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="url"
                      className="admin-input"
                      placeholder="https://www.instagram.com/reel/..."
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      style={{ paddingLeft: '38px' }}
                    />
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px' }}>
                      📸
                    </span>
                  </div>
                  {formData.instagramUrl && (
                    <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--admin-brand)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✓ Reel active</span>
                      <a
                        href={formData.instagramUrl.startsWith('http') ? formData.instagramUrl : `https://${formData.instagramUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--admin-brand)', textDecoration: 'underline' }}
                      >
                        Test Reel Link ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Direct Website Link Preview */}
                {(formData.sku || formData.slug) && (
                  <div style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--admin-ink)' }}>🔗 Direct Design Link:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const directUrl = `https://www.thepaperstory.store/product/${formData.sku || formData.slug}`;
                          navigator.clipboard.writeText(directUrl);
                          showToast('Direct link copied to clipboard!');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--admin-brand)', fontWeight: '600', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                      >
                        Copy Link
                      </button>
                    </div>
                    <code style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: 'var(--admin-muted)', wordBreak: 'break-all' }}>
                      https://www.thepaperstory.store/product/{formData.sku || formData.slug}
                    </code>
                  </div>
                )}

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
                </>
                )}
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

