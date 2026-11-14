import React, { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function MediaPage() {
  const { media, addMedia, deleteMedia, products } = useAdminData();
  const showToast = useAdminToast();

  const [search, setSearch] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [rotatingUrl, setRotatingUrl] = useState(null);

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

  const handleRotate = async (url) => {
    setRotatingUrl(url);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;
      let targetWidth = naturalHeight;
      let targetHeight = naturalWidth;
      const maxDim = 1600;
      if (Math.max(targetWidth, targetHeight) > maxDim) {
        const scale = maxDim / Math.max(targetWidth, targetHeight);
        targetWidth = Math.round(targetWidth * scale);
        targetHeight = Math.round(targetHeight * scale);
      }
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -targetHeight / 2, -targetWidth / 2, targetHeight, targetWidth);
      const rotated = canvas.toDataURL('image/jpeg', 0.88);
      addMedia(rotated);
      deleteMedia(url);
      showToast('Image rotated 90° and updated');
    } catch (e) {
      alert('Could not rotate this media item.');
    } finally {
      setRotatingUrl(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
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
                  📋 Copy
                </button>
                <button
                  type="button"
                  onClick={() => handleRotate(url)}
                  disabled={rotatingUrl === url}
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  title="Rotate 90° clockwise"
                >
                  {rotatingUrl === url ? '⏳' : '⟳'}
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

