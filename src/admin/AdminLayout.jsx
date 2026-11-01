import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthGuard';
import './admin.css';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { path: '/admin/products', label: 'Products', icon: '🏷️' },
  { path: '/admin/categories', label: 'Categories', icon: '📂' },
  { path: '/admin/orders', label: 'Orders', icon: '📦' },
  { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/admin/deals', label: 'Deals & Offers', icon: '🎁' },
  { path: '/admin/marquee', label: 'Marquee Strip', icon: '📢' },
  { path: '/admin/payments', label: 'Payment Options', icon: '💳' },
  { path: '/admin/media', label: 'Media Library', icon: '🖼️' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export const ToastContext = React.createContext(null);

export default function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const currentNav = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="admin-layout">
        {/* Mobile Overlay */}
        {isMobileNavOpen && (
          <div
            onClick={() => setIsMobileNavOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(43,27,31,0.4)',
              zIndex: 35,
            }}
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${isMobileNavOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-brand-logo">TPS</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
                The Paper Story
              </div>
              <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>Admin Portal</div>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsMobileNavOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--admin-border)' }}>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="admin-btn admin-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="admin-main">
          {/* Header */}
          <header className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
                className="mobile-hamburger"
              >
                ☰
              </button>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--admin-ink)' }}>
                {currentNav ? currentNav.label : 'Admin Portal'}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '13px', padding: '6px 14px' }}
              >
                👁️ View Live Site
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--admin-brand-light)',
                    color: 'var(--admin-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '13px',
                  }}
                >
                  A
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--admin-ink)' }}>Admin</span>
              </div>
            </div>
          </header>

          {/* Page Outlet */}
          <main className="admin-content-area">
            <Outlet />
          </main>
        </div>

        {/* Floating Toast Alerts */}
        <div className="admin-toast-container">
          {toasts.map((t) => (
            <div key={t.id} className="admin-toast">
              <span>{t.type === 'error' ? '❌' : '✅'}</span>
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = React.useContext(ToastContext);
  return ctx ? ctx.showToast : () => {};
}

