import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdminData();
  const showToast = useAdminToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    position: 1,
    visible: true,
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      position: categories.length + 1,
      visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      position: cat.position ?? 1,
      visible: cat.visible ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    const count = products.filter((p) => p.category === name || p.categoryId === id).length;
    if (count > 0) {
      if (!window.confirm(`Warning: ${count} products are currently assigned to this category. Delete anyway?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Delete category "${name}"?`)) return;
    }

    deleteCategory(id);
    showToast('Category deleted');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
      showToast('Category updated');
    } else {
      addCategory(formData);
      showToast('Category created');
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Categories ({categories.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Organize suites into collections and storefront navigation groups.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          + Add Category
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Products</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .slice()
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((cat, idx) => {
                  const prodCount = products.filter((p) => p.category === cat.name || p.categoryId === cat.id).length;
                  return (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: '700', color: 'var(--admin-muted)' }}>#{cat.position || idx + 1}</td>
                      <td style={{ fontWeight: '600', color: 'var(--admin-ink)' }}>{cat.name}</td>
                      <td style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>{cat.slug}</td>
                      <td style={{ maxWidth: '300px', fontSize: '13px', color: 'var(--admin-muted)' }}>{cat.description}</td>
                      <td>
                        <span className="admin-badge admin-badge-brand">
                          {prodCount} items
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${cat.visible ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                          {cat.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(cat)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(cat.id, cat.name)} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
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

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Category Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Slug</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value, 10) || 1 })}
                    />
                  </div>

                  <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                        style={{ accentColor: 'var(--admin-brand)' }}
                      />
                      Visible on storefront
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

