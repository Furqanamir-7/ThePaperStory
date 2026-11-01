import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function ReviewsPage() {
  const { reviews, products, addReview, updateReview, deleteReview } = useAdminData();
  const showToast = useAdminToast();

  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    customerName: '',
    rating: 5,
    text: '',
    status: 'published',
    verified: true,
  });

  const filteredReviews = reviews.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === 'all' || r.rating === parseInt(filterRating, 10);
    return matchSearch && matchRating;
  });

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({
      productName: products[0]?.name || 'Luxury Wedding Suite',
      customerName: '',
      rating: 5,
      text: '',
      status: 'published',
      verified: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingReview(r);
    setFormData({
      productName: r.productName,
      customerName: r.customerName,
      rating: r.rating,
      text: r.text,
      status: r.status,
      verified: !!r.verified,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this client review?')) {
      deleteReview(id);
      showToast('Review deleted');
    }
  };

  const toggleStatus = (r) => {
    const nextStatus = r.status === 'published' ? 'hidden' : 'published';
    updateReview(r.id, { status: nextStatus });
    showToast(`Review ${nextStatus === 'published' ? 'published' : 'hidden'}`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.text) return;

    if (editingReview) {
      updateReview(editingReview.id, formData);
      showToast('Review updated');
    } else {
      addReview(formData);
      showToast('Review added');
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Client Reviews ({reviews.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Manage client testimonials, verify buyer stories, and control visibility.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          + Add Client Review
        </button>
      </div>

      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by client name, text, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
            style={{ flex: 1, minWidth: '280px' }}
          />

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="admin-select"
            style={{ width: '180px' }}
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★</option>
            <option value="3">3 Stars ★★★</option>
          </select>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Client Name</th>
                <th>Review Text</th>
                <th>Product</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span style={{ color: 'var(--admin-gold)', fontWeight: '700' }}>
                      {'★'.repeat(r.rating)}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{r.customerName}</div>
                    {r.verified && (
                      <span className="admin-badge admin-badge-success" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        ✓ Verified Buyer
                      </span>
                    )}
                  </td>
                  <td style={{ maxWidth: '360px', fontSize: '13px', lineHeight: '1.4' }}>
                    "{r.text}"
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--admin-muted)' }}>{r.productName}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(r)}
                      className={`admin-badge ${r.status === 'published' ? 'admin-badge-success' : 'admin-badge-neutral'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {r.status === 'published' ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(r)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                {editingReview ? 'Edit Review' : 'Add Client Review'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Client Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Rating</label>
                    <select
                      className="admin-select"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                    >
                      <option value="5">5 Stars (★★★★★)</option>
                      <option value="4">4 Stars (★★★★)</option>
                      <option value="3">3 Stars (★★★)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Product Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Review Text *</label>
                  <textarea
                    rows="4"
                    className="admin-textarea"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    Verified Buyer Badge
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.status === 'published'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'hidden' })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    Published Immediately
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

