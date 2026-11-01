import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function MediaPage() {
  const { media, addMedia, deleteMedia, products } = useAdminData();
  const showToast = useAdminToast();

  const [search, setSearch] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Collect all images from products and media list
  const allMedia = Array.from(
    new Set([
      ...media,
      ...products.flatMap((p) => p.images || []),
    ])
  ).filter((url) => url.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    addMedia(newUrl.trim());
    setNewUrl('');
    showToast('Media added to library');
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard');
  };

  const handleDelete = (url) => {
    if (window.confirm('Delete this image from media library?')) {
      deleteMedia(url);
      showToast('Media deleted');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Media Library ({allMedia.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Browse and copy links for all suite imagery, stationery photos, and uploaded banners.
          </p>
        </div>
      </div>

      {/* Add Media Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Add new image path or URL (e.g. /wedding-invites/design-1/01.jpg)..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            style={{ flex: 1, minWidth: '300px' }}
          />
          <button type="submit" className="admin-btn admin-btn-primary">
            + Add to Library
          </button>
        </form>

        <div style={{ marginTop: '12px' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Search images by filename or path..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Media Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {allMedia.map((url, idx) => (
          <div
            key={idx}
            className="admin-card"
            style={{ padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ height: '220px', backgroundColor: '#FAFAF9', overflow: 'hidden' }}>
              <img
                src={url}
                alt={`Media ${idx}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>

            <div style={{ padding: '10px 12px', background: '#fff' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--admin-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: '8px',
                }}
                title={url}
              >
                {url}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => copyUrl(url)}
                  className="admin-btn admin-btn-secondary"
                  style={{ flex: 1, padding: '4px', fontSize: '11px' }}
                >
                  📋 Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(url)}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
