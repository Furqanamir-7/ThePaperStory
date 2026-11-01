import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function DealsPage() {
  const { deals, addDeal, updateDeal, deleteDeal } = useAdminData();
  const showToast = useAdminToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    type: 'percentage',
    value: 10,
    bannerText: '',
    startsAt: new Date().toISOString().slice(0, 10),
    endsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    active: true,
  });

  const openAddModal = () => {
    setEditingDeal(null);
    setFormData({
      title: '',
      code: '',
      type: 'percentage',
      value: 10,
      bannerText: '',
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (d) => {
    setEditingDeal(d);
    setFormData({ ...d });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this promotional deal?')) {
      deleteDeal(id);
      showToast('Deal deleted');
    }
  };

  const toggleActive = (d) => {
    updateDeal(d.id, { active: !d.active });
    showToast(`Deal ${!d.active ? 'activated' : 'deactivated'}`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code) return;

    if (editingDeal) {
      updateDeal(editingDeal.id, formData);
      showToast('Deal updated');
    } else {
      addDeal(formData);
      showToast('Deal created');
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Deals & Offers ({deals.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Create promotional coupon codes and banner promotions for the storefront.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          + Add New Deal
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Deal Title</th>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Banner Text</th>
                <th>Validity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: '600' }}>{d.title}</td>
                  <td>
                    <span className="admin-badge admin-badge-brand" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                      {d.code}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--admin-brand)' }}>
                    {d.type === 'percentage' ? `${d.value}% OFF` : `PKR ${d.value} OFF`}
                  </td>
                  <td style={{ maxWidth: '280px', fontSize: '13px', color: 'var(--admin-muted)' }}>{d.bannerText || '—'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>
                    {d.startsAt} to {d.endsAt}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(d)}
                      className={`admin-badge ${d.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {d.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(d)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
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
                {editingDeal ? 'Edit Deal' : 'Create New Promotional Deal'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Campaign Title *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Wedding Season Launch"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Coupon Code *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. WEDDING10"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Discount Type</label>
                    <select
                      className="admin-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed PKR Amount</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Discount Value</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Storefront Banner Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Enjoy 10% OFF with code WEDDING10"
                    value={formData.bannerText}
                    onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Start Date</label>
                    <input
                      type="date"
                      className="admin-input"
                      value={formData.startsAt}
                      onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">End Date</label>
                    <input
                      type="date"
                      className="admin-input"
                      value={formData.endsAt}
                      onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    Active & redeemable at checkout
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

