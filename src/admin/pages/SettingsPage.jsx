import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function SettingsPage() {
  const { settings, updateSettings, verifyPassword, changeAdminPassword, exportAllData } = useAdminData();
  const showToast = useAdminToast();

  const [storeForm, setStoreForm] = useState({ ...settings });

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  const handleSaveStore = (e) => {
    e.preventDefault();
    updateSettings(storeForm);
    showToast('Settings saved successfully');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassError('');

    if (!verifyPassword(currentPass)) {
      setPassError('Current password is incorrect.');
      return;
    }

    if (!newPass || newPass.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    changeAdminPassword(newPass);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    showToast('Admin password changed successfully!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Store Settings
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Configure store metadata, contact details, security credentials and data backups.
          </p>
        </div>

        <button onClick={exportAllData} className="admin-btn admin-btn-secondary">
          💾 Export Full JSON Backup
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* General Store Information */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700' }}>Store Profile & Contact</h3>

          <form onSubmit={handleSaveStore}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Store Brand Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Store Currency</label>
                <input
                  type="text"
                  className="admin-input"
                  value={storeForm.currency}
                  onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Tagline</label>
              <input
                type="text"
                className="admin-input"
                value={storeForm.tagline}
                onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">WhatsApp Number</label>
                <input
                  type="text"
                  className="admin-input"
                  value={storeForm.whatsappNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Contact Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={storeForm.contactEmail}
                  onChange={(e) => setStoreForm({ ...storeForm, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Order Reference Prefix</label>
                <input
                  type="text"
                  className="admin-input"
                  value={storeForm.orderPrefix}
                  onChange={(e) => setStoreForm({ ...storeForm, orderPrefix: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  className="admin-input"
                  value={storeForm.lowStockThreshold}
                  onChange={(e) => setStoreForm({ ...storeForm, lowStockThreshold: parseInt(e.target.value, 10) || 5 })}
                />
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div style={{ padding: '16px', backgroundColor: '#FAFAF9', borderRadius: '10px', border: '1px solid var(--admin-border)', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={storeForm.maintenanceMode}
                  onChange={(e) => setStoreForm({ ...storeForm, maintenanceMode: e.target.checked })}
                  style={{ accentColor: 'var(--admin-brand)', width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Storefront Maintenance Mode</div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>
                    Display a temporary maintenance banner across the storefront during updates.
                  </div>
                </div>
              </label>
            </div>

            <button type="submit" className="admin-btn admin-btn-primary">
              Save Store Profile
            </button>
          </form>
        </div>

        {/* Change Admin Password */}
        <div>
          <div className="admin-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700' }}>Change Admin Password</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--admin-muted)' }}>
              Current default password is <code>TPS-786</code>. Update it to secure your portal.
            </p>

            {passError && (
              <div style={{ padding: '10px 14px', backgroundColor: '#FFEBEE', color: 'var(--admin-danger)', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
                {passError}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="admin-form-group">
                <label className="admin-label">Current Password</label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Enter current password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Min 6 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Confirm New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Repeat new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="admin-btn admin-btn-secondary" style={{ width: '100%' }}>
                Update Password
              </button>
            </form>
          </div>

          {/* Quick Info Box */}
          <div className="admin-card" style={{ backgroundColor: 'var(--admin-brand-light)', border: 'none' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--admin-brand-dark)', fontWeight: '700' }}>
              Admin Security Notice
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--admin-brand-dark)', lineHeight: '1.5' }}>
              • Rate limiting prevents brute force logins (5 attempts / 15 min).
              <br />• Inactive sessions auto-expire after 30 minutes.
              <br />• <code>/admin</code> is excluded from search engine crawlers in robots.txt.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
