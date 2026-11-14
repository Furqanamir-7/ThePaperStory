import React, { useState, useEffect } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function SettingsPage() {
  const { settings, updateSettings, verifyPassword, changeAdminPassword, exportAllData } = useAdminData();
  const showToast = useAdminToast();

  const [storeForm, setStoreForm] = useState({
    heroDesktopVideo: '/hero-section.mp4',
    heroMobileVideo: '/hero-showcase-mobile.mp4',
    heroDesktopZoom: 100,
    heroMobileZoom: 100,
    heroOverlayDarkness: 20,
    ...settings,
  });

  useEffect(() => {
    if (settings) {
      setStoreForm((prev) => ({
        heroDesktopVideo: '/hero-section.mp4',
        heroMobileVideo: '/hero-showcase-mobile.mp4',
        heroDesktopZoom: 100,
        heroMobileZoom: 100,
        heroOverlayDarkness: 20,
        ...prev,
        ...settings,
      }));
    }
  }, [settings]);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  // Webhook Test State
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState(null);

  const webhookUrl = 'https://www.thepaperstory.store/api/whatsapp/webhook';
  const verifyToken = 'thepaperstory_whatsapp_webhook_2026';

  const handleDesktopFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setStoreForm((prev) => ({ ...prev, heroDesktopVideo: url }));
    showToast(`Loaded "${file.name}" for Desktop preview. Click 'Save' to apply.`);
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setStoreForm((prev) => ({ ...prev, heroMobileVideo: url }));
    showToast(`Loaded "${file.name}" for Mobile preview. Click 'Save' to apply.`);
  };

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

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setWebhookResult(null);
    try {
      const res = await fetch('/api/whatsapp/webhook');
      const data = await res.json();
      setWebhookResult({ ok: res.ok, data });
      showToast(res.ok ? 'Webhook is active & responsive!' : 'Webhook check returned error');
    } catch (err) {
      setWebhookResult({ ok: false, error: err.message });
      showToast('Could not reach webhook endpoint');
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Store Settings
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Configure store metadata, WhatsApp webhook integration, credentials, and backups.
          </p>
        </div>

        <button onClick={exportAllData} className="admin-btn admin-btn-secondary">
          📥 Export Full JSON Backup
        </button>
      </div>

      <div className="admin-settings-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* Left Column: General Store Profile + WhatsApp Webhook */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* General Store Information */}
          <div className="admin-card">
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700' }}>Store Profile & Contact</h3>

            <form onSubmit={handleSaveStore}>
              <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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

              <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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

          {/* Hero Section Video Showcase Card */}
          <div className="admin-card" style={{ border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🎬</span>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--admin-ink)' }}>
                    Hero Section Video Showcase
                  </h3>
                  <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                    DESKTOP & MOBILE
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
                  Set, switch, or upload the showcase video playing in the hero section frame on desktop and mobile.
                </p>
              </div>
            </div>

            {/* Desktop Video Section */}
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label className="admin-label" style={{ margin: 0, fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💻 Desktop Hero Video</span>
                </label>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Plays on laptops & wide screens</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1, minWidth: '220px', fontFamily: 'monospace', fontSize: '13px' }}
                  placeholder="/hero-showcase.mp4 or video URL"
                  value={storeForm.heroDesktopVideo || ''}
                  onChange={(e) => setStoreForm({ ...storeForm, heroDesktopVideo: e.target.value })}
                />
                <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', margin: 0 }}>
                  📁 Pick Video File
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    style={{ display: 'none' }}
                    onChange={handleDesktopFileChange}
                  />
                </label>
              </div>

              {/* Desktop Zoom Control */}
              <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>
                    🔍 Desktop Zoom / Scale: <strong>{storeForm.heroDesktopZoom ?? 100}%</strong>
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setStoreForm((prev) => ({ ...prev, heroDesktopZoom: Math.max(50, (prev.heroDesktopZoom ?? 100) - 5) }))}
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}
                      title="Zoom Out a bit"
                    >
                      − Zoom Out
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreForm((prev) => ({ ...prev, heroDesktopZoom: Math.min(160, (prev.heroDesktopZoom ?? 100) + 5) }))}
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}
                      title="Zoom In"
                    >
                      + Zoom In
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  step="5"
                  value={storeForm.heroDesktopZoom ?? 100}
                  onChange={(e) => setStoreForm({ ...storeForm, heroDesktopZoom: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', accentColor: 'var(--admin-brand)', cursor: 'pointer' }}
                />
              </div>

              {/* Desktop Live Preview */}
              {storeForm.heroDesktopVideo && (
                <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #CBD5E1', backgroundColor: '#000', maxHeight: '180px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <video
                    key={storeForm.heroDesktopVideo}
                    src={storeForm.heroDesktopVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{
                      width: '100%',
                      maxHeight: '180px',
                      objectFit: 'cover',
                      transform: `scale(${(storeForm.heroDesktopZoom ?? 100) / 100})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Mobile Video Section */}
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label className="admin-label" style={{ margin: 0, fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📱 Mobile Hero Video</span>
                </label>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Plays on smartphone screens</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1, minWidth: '220px', fontFamily: 'monospace', fontSize: '13px' }}
                  placeholder="/hero-showcase-mobile.mp4 or video URL"
                  value={storeForm.heroMobileVideo || ''}
                  onChange={(e) => setStoreForm({ ...storeForm, heroMobileVideo: e.target.value })}
                />
                <label className="admin-btn admin-btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', margin: 0 }}>
                  📁 Pick Video File
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    style={{ display: 'none' }}
                    onChange={handleMobileFileChange}
                  />
                </label>
              </div>

              {/* Mobile Zoom Control */}
              <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>
                    🔍 Mobile Zoom / Scale: <strong>{storeForm.heroMobileZoom ?? 100}%</strong>
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setStoreForm((prev) => ({ ...prev, heroMobileZoom: Math.max(50, (prev.heroMobileZoom ?? 100) - 5) }))}
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}
                      title="Zoom Out a bit"
                    >
                      − Zoom Out
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreForm((prev) => ({ ...prev, heroMobileZoom: Math.min(160, (prev.heroMobileZoom ?? 100) + 5) }))}
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}
                      title="Zoom In"
                    >
                      + Zoom In
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  step="5"
                  value={storeForm.heroMobileZoom ?? 100}
                  onChange={(e) => setStoreForm({ ...storeForm, heroMobileZoom: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', accentColor: 'var(--admin-brand)', cursor: 'pointer' }}
                />
              </div>

              {/* Mobile Live Preview */}
              {storeForm.heroMobileVideo && (
                <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #CBD5E1', backgroundColor: '#000', maxHeight: '200px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <video
                    key={storeForm.heroMobileVideo}
                    src={storeForm.heroMobileVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{
                      width: '130px',
                      height: '200px',
                      objectFit: 'cover',
                      transform: `scale(${(storeForm.heroMobileZoom ?? 100) / 100})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Overlay Tint Darkness */}
            <div style={{ padding: '14px 16px', backgroundColor: '#FAFAF9', borderRadius: '10px', border: '1px solid var(--admin-border)', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="admin-label" style={{ margin: 0, fontWeight: '600' }}>
                  Hero Video Dark Tint Overlay: <strong>{storeForm.heroOverlayDarkness ?? 20}%</strong>
                </label>
                <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>Keeps white titles clearly readable</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={storeForm.heroOverlayDarkness ?? 20}
                onChange={(e) => setStoreForm({ ...storeForm, heroOverlayDarkness: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: 'var(--admin-brand)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                <span>0% (Clear)</span>
                <span>20% (Recommended)</span>
                <span>60% (Deep Dim)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  updateSettings({
                    heroDesktopVideo: storeForm.heroDesktopVideo,
                    heroMobileVideo: storeForm.heroMobileVideo,
                    heroDesktopZoom: storeForm.heroDesktopZoom,
                    heroMobileZoom: storeForm.heroMobileZoom,
                    heroOverlayDarkness: storeForm.heroOverlayDarkness,
                  });
                  showToast('Hero Background Videos & Zoom Settings saved live!');
                }}
                className="admin-btn admin-btn-primary"
              >
                💾 Save Hero Videos
              </button>
              <button
                type="button"
                onClick={() => {
                  const defaults = {
                    heroDesktopVideo: '/hero-section.mp4',
                    heroMobileVideo: '/hero-showcase-mobile.mp4',
                    heroDesktopZoom: 100,
                    heroMobileZoom: 100,
                    heroOverlayDarkness: 20,
                  };
                  setStoreForm((prev) => ({ ...prev, ...defaults }));
                  updateSettings(defaults);
                  showToast('Hero videos and zoom reset to defaults.');
                }}
                className="admin-btn admin-btn-secondary"
              >
                ↺ Reset to Defaults
              </button>
            </div>
          </div>

          {/* WhatsApp API Webhook Card */}
          <div className="admin-card" style={{ border: '1px solid #25D366', backgroundColor: '#FBFFFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🟢</span>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#075E54' }}>
                    WhatsApp Cloud API Webhook
                  </h3>
                  <span style={{ backgroundColor: '#DCF8C6', color: '#075E54', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                    ACTIVE & READY
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#4B5563' }}>
                  Connect Meta WhatsApp Business Cloud API to automatically capture incoming customer inquiries, orders, and messages directly into your store.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {testingWebhook ? 'Pinging...' : '⚡ Test Webhook'}
              </button>
            </div>

            {/* Test Results Banner */}
            {webhookResult && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  backgroundColor: webhookResult.ok ? '#DCF8C6' : '#FFEBEE',
                  color: webhookResult.ok ? '#075E54' : '#C62828',
                  border: `1px solid ${webhookResult.ok ? '#A7F3D0' : '#FFCDD2'}`,
                }}
              >
                {webhookResult.ok ? (
                  <div>
                    <strong>✓ Webhook Active & Verified:</strong> {webhookResult.data?.message || 'Handshake responsive'}
                    <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.85 }}>
                      Timestamp: {webhookResult.data?.timestamp}
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong>✕ Webhook Error:</strong> {webhookResult.error || 'Endpoint unreachable'}
                  </div>
                )}
              </div>
            )}

            {/* Callback URL */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>
                Callback URL (for Meta App Dashboard)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="admin-input"
                  style={{ backgroundColor: '#fff', fontFamily: 'monospace', fontSize: '12px', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleCopy(webhookUrl, 'Callback URL')}
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Verify Token */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>
                Verify Token (for Meta App Dashboard)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value={verifyToken}
                  className="admin-input"
                  style={{ backgroundColor: '#fff', fontFamily: 'monospace', fontSize: '12px', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleCopy(verifyToken, 'Verify Token')}
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Quick Setup Instructions */}
            <div style={{ padding: '12px 14px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#4B5563', lineHeight: '1.6' }}>
              <strong style={{ color: '#111827' }}>How to connect in Meta Developer Portal:</strong>
              <ol style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" style={{ color: '#075E54', textDecoration: 'underline' }}>Meta for Developers</a> → Select your WhatsApp Business App.</li>
                <li>Navigate to <strong>WhatsApp → Configuration → Webhook → Edit</strong>.</li>
                <li>Paste the <strong>Callback URL</strong> and <strong>Verify Token</strong> above, then click <strong>Verify and Save</strong>.</li>
                <li>Click <strong>Manage Webhook fields</strong> and check <code>messages</code> and <code>message_template_status_update</code>.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Credentials */}
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
