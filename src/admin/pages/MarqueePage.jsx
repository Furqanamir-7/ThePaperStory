import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function MarqueePage() {
  const { marquee, updateMarquee } = useAdminData();
  const showToast = useAdminToast();

  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleToggleWhole = () => {
    updateMarquee({ enabled: !marquee.enabled });
    showToast(`Marquee strip ${!marquee.enabled ? 'enabled' : 'disabled'}`);
  };

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const item = {
      id: `m-${Date.now()}`,
      text: newMessage.trim().toUpperCase(),
      active: true,
    };
    updateMarquee({ items: [...marquee.items, item] });
    setNewMessage('');
    showToast('Announcement message added');
  };

  const handleDelete = (id) => {
    updateMarquee({ items: marquee.items.filter((it) => it.id !== id) });
    showToast('Message removed');
  };

  const handleToggleItem = (id) => {
    updateMarquee({
      items: marquee.items.map((it) => (it.id === id ? { ...it, active: !it.active } : it)),
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    updateMarquee({
      items: marquee.items.map((it) => (it.id === id ? { ...it, text: editText.trim().toUpperCase() } : it)),
    });
    setEditingId(null);
    showToast('Message updated');
  };

  const moveItem = (index, delta) => {
    const nextIdx = index + delta;
    if (nextIdx < 0 || nextIdx >= marquee.items.length) return;
    const reordered = [...marquee.items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIdx, 0, moved);
    updateMarquee({ items: reordered });
  };

  const activeItems = marquee.items.filter((it) => it.active);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Marquee Announcement Strip
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Configure the scrolling banner messages displayed at the top of the storefront.
          </p>
        </div>

        <button
          onClick={handleToggleWhole}
          className={`admin-btn ${marquee.enabled ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
        >
          {marquee.enabled ? '✓ Strip Enabled' : 'Strip Disabled'}
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="admin-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>
            Live Preview {marquee.enabled ? '' : '(Currently Disabled on storefront)'}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>
            Speed: {marquee.speed} • Direction: {marquee.direction}
          </span>
        </div>

        <div
          style={{
            backgroundColor: marquee.bgColor || '#A62341',
            color: marquee.textColor || '#FFFFFF',
            padding: '12px 0',
            borderRadius: '8px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontWeight: '600',
            letterSpacing: '1px',
            fontSize: '13px',
            opacity: marquee.enabled ? 1 : 0.5,
          }}
        >
          <div style={{ display: 'flex', gap: '32px', animation: 'marqueeScroll 20s linear infinite' }}>
            {activeItems.length > 0 ? (
              [...activeItems, ...activeItems].map((item, idx) => (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
                  <span>{item.text}</span>
                  <span style={{ opacity: 0.6 }}>✦</span>
                </span>
              ))
            ) : (
              <span style={{ padding: '0 20px' }}>No active messages configured</span>
            )}
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Strip Appearance Settings */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700' }}>Banner Settings</h3>

          <div className="admin-form-group">
            <label className="admin-label">Background Color</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={marquee.bgColor || '#A62341'}
                onChange={(e) => updateMarquee({ bgColor: e.target.value })}
                style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              />
              <input
                type="text"
                className="admin-input"
                value={marquee.bgColor || '#A62341'}
                onChange={(e) => updateMarquee({ bgColor: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Text Color</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={marquee.textColor || '#FFFFFF'}
                onChange={(e) => updateMarquee({ textColor: e.target.value })}
                style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              />
              <input
                type="text"
                className="admin-input"
                value={marquee.textColor || '#FFFFFF'}
                onChange={(e) => updateMarquee({ textColor: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Scroll Speed</label>
            <select
              className="admin-select"
              value={marquee.speed || 'medium'}
              onChange={(e) => updateMarquee({ speed: e.target.value })}
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Scroll Direction</label>
            <select
              className="admin-select"
              value={marquee.direction || 'left'}
              onChange={(e) => updateMarquee({ direction: e.target.value })}
            >
              <option value="left">Right to Left</option>
              <option value="right">Left to Right</option>
            </select>
          </div>
        </div>

        {/* Message Items Manager */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700' }}>
            Announcement Messages ({marquee.items?.length || 0})
          </h3>

          {/* Add Message input */}
          <form onSubmit={handleAddMessage} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. FLAT 10% OFF ON LUXURY WEDDING INVITATIONS"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="admin-btn admin-btn-primary">
              + Add Message
            </button>
          </form>

          {/* Message List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {marquee.items?.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#FAFAF9',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border)',
                }}
              >
                {editingId === item.id ? (
                  <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                    <button onClick={() => saveEdit(item.id)} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px' }}>Save</button>
                    <button onClick={() => setEditingId(null)} className="admin-btn admin-btn-secondary" style={{ padding: '6px 10px' }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--admin-muted)', cursor: 'grab', fontSize: '14px' }}>☰</span>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: item.active ? 'var(--admin-ink)' : 'var(--admin-muted)' }}>
                        {item.text}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        style={{ border: 'none', background: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveItem(index, 1)}
                        disabled={index === marquee.items.length - 1}
                        style={{ border: 'none', background: 'none', cursor: index === marquee.items.length - 1 ? 'default' : 'pointer', opacity: index === marquee.items.length - 1 ? 0.3 : 1 }}
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className={`admin-badge ${item.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        {item.active ? 'Active' : 'Disabled'}
                      </button>
                      <button onClick={() => startEdit(item)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

