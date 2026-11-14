import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function PaymentsPage() {
  const { payments, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useAdminData();
  const showToast = useAdminToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Bank Transfer',
    instructions: '',
    accountDetails: '',
    requireProof: true,
    active: true,
  });

  const openAddModal = () => {
    setEditingPayment(null);
    setFormData({
      name: '',
      type: 'Bank Transfer',
      instructions: '',
      accountDetails: '',
      requireProof: true,
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPayment(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this payment option?')) {
      deletePaymentMethod(id);
      showToast('Payment method removed');
    }
  };

  const toggleActive = (p) => {
    updatePaymentMethod(p.id, { active: !p.active });
    showToast(`Payment method ${!p.active ? 'enabled' : 'disabled'}`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingPayment) {
      updatePaymentMethod(editingPayment.id, formData);
      showToast('Payment method updated');
    } else {
      addPaymentMethod(formData);
      showToast('Payment method created');
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Payment Options ({payments.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Configure client payment methods, bank account numbers and proof upload requirements.
          </p>
        </div>

        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          + Add Payment Option
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Type</th>
                <th>Account Details</th>
                <th>Instructions</th>
                <th>Proof Required</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '600' }}>{p.name}</td>
                  <td>
                    <span className="admin-badge admin-badge-brand">{p.type}</span>
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '13px', color: 'var(--admin-muted)' }}>
                    {p.accountDetails || '—'}
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '13px', color: 'var(--admin-muted)' }}>
                    {p.instructions || '—'}
                  </td>
                  <td>
                    <span className={`admin-badge ${p.requireProof ? 'admin-badge-warning' : 'admin-badge-neutral'}`}>
                      {p.requireProof ? 'Yes (Receipt)' : 'No'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(p)}
                      className={`admin-badge ${p.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {p.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(p)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
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
                {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Method Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Bank Transfer (Meezan)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Type</label>
                    <select
                      className="admin-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Mobile Wallet">Mobile Wallet (JazzCash/Easypaisa)</option>
                      <option value="Credit / Debit Card">Credit / Debit Card</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Account Details (shown to customer)</label>
                  <textarea
                    rows="2"
                    className="admin-textarea"
                    placeholder="Bank name, Account Title, IBAN, Wallet Number..."
                    value={formData.accountDetails}
                    onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Checkout Instructions</label>
                  <textarea
                    rows="3"
                    className="admin-textarea"
                    placeholder="Instructions displayed to customer upon selecting this method..."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.requireProof}
                      onChange={(e) => setFormData({ ...formData, requireProof: e.target.checked })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    Require Payment Receipt Upload
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      style={{ accentColor: 'var(--admin-brand)' }}
                    />
                    Enabled on Checkout
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Payment Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

