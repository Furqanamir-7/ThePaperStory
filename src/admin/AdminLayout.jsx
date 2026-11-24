import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthGuard';
import { useAdminData } from './AdminDataContext';
import './admin.css';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { path: '/admin/seo', label: 'SEO & Analytics', icon: '🔍' },
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

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[Admin Runtime Error]:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', margin: '20px' }}>
          <span style={{ fontSize: '36px' }}>⚠️</span>
          <h3 style={{ margin: '12px 0 6px', color: '#991B1B', fontFamily: 'serif' }}>Something went wrong loading this panel</h3>
          <p style={{ color: '#6B7280', fontSize: '13px', maxWidth: '480px', margin: '0 auto 16px' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="admin-btn admin-btn-primary"
            style={{ margin: '0 auto' }}
          >
            ↻ Reload Panel
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ToastContext = React.createContext(null);

export default function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tps_admin_theme') || 'light';
  });

  const { logout, currentAdmin = 'TPS' } = useAdminAuth();
  const adminData = useAdminData();
  const syncStatus = adminData?.syncStatus || 'synced';
  const location = useLocation();
  const navigate = useNavigate();

  const adminInitials = currentAdmin ? currentAdmin.slice(0, 2).toUpperCase() : 'TPS';
  const adminDisplayName = currentAdmin || 'TPS';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-admin-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-admin-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('tps_admin_theme', nextTheme);
    } catch (e) {}
    if (nextTheme === 'dark') {
      document.documentElement.setAttribute('data-admin-theme', 'dark');
      showToast('Dark mode enabled 🌙', 'info');
    } else {
      document.documentElement.removeAttribute('data-admin-theme');
      showToast('Light mode enabled ☀️', 'info');
    }
  };

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
          <div className="admin-sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src="/logo.png"
                alt="The Paper Story"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'contain',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(166, 35, 65, 0.15)',
                }}
              />
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
                  The Paper Story
                </div>
                <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>Admin Portal</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="admin-sidebar-close-btn"
              aria-label="Close navigation"
            >
              ✕
            </button>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="admin-hamburger-btn"
                aria-label="Toggle navigation menu"
              >
                ☰
              </button>
              <h2 className="admin-header-title">
                {currentNav ? currentNav.label : 'Admin Portal'}
              </h2>
            </div>

            <div className="admin-header-actions">
              <button
                type="button"
                onClick={() => {
                  if (adminData?.refreshAdminData) {
                    adminData.refreshAdminData();
                    showToast('Checking cloud database for updates...', 'info');
                  }
                }}
                className="admin-btn admin-btn-secondary admin-btn-sync"
                title="Force refresh data from Supabase / Cloud database"
              >
                <span>↻</span>
                <span className="admin-hide-mobile">Sync Now</span>
              </button>

              <span
                className="admin-sync-pill"
                title={
                  syncStatus === 'supabase'
                    ? 'Connected to Supabase live database. All edits sync in real-time across devices.'
                    : syncStatus === 'syncing'
                    ? 'Saving your edits to cloud database...'
                    : syncStatus === 'synced'
                    ? 'Cloud sync active.'
                    : 'Supabase project is paused or offline. Edits are saved on this device. Click Supabase dashboard to restore.'
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor:
                    syncStatus === 'supabase' || syncStatus === 'synced'
                      ? '#DCFCE7'
                      : syncStatus === 'syncing'
                      ? '#FEF3C7'
                      : '#FFEDD5',
                  color:
                    syncStatus === 'supabase' || syncStatus === 'synced'
                      ? '#166534'
                      : syncStatus === 'syncing'
                      ? '#92400E'
                      : '#C2410C',
                  border: `1px solid ${
                    syncStatus === 'supabase' || syncStatus === 'synced'
                      ? '#BBF7D0'
                      : syncStatus === 'syncing'
                      ? '#FDE68A'
                      : '#FDBA74'
                  }`,
                }}
              >
                <span>
                  {syncStatus === 'supabase'
                    ? '🟢'
                    : syncStatus === 'synced'
                    ? '🟢'
                    : syncStatus === 'syncing'
                    ? '🔄'
                    : '🟠'}
                </span>
                <span className="admin-hide-mobile">
                  {syncStatus === 'supabase'
                    ? 'Supabase Live'
                    : syncStatus === 'synced'
                    ? 'Cloud Synced'
                    : syncStatus === 'syncing'
                    ? 'Saving...'
                    : 'Local Mode'}
                </span>
                <span className="admin-show-mobile">
                  {syncStatus === 'supabase' || syncStatus === 'synced'
                    ? 'Live'
                    : syncStatus === 'syncing'
                    ? 'Saving'
                    : 'Local'}
                </span>
              </span>

              <button
                type="button"
                onClick={toggleTheme}
                className="admin-btn admin-btn-secondary admin-btn-theme"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark mode"
                style={{ padding: '6px 10px', fontSize: '13px' }}
              >
                <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="admin-hide-mobile">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-secondary admin-btn-viewsite"
                title="View Live Storefront"
              >
                <span>👁️</span>
                <span className="admin-hide-mobile">View Site</span>
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
                    fontSize: '12px',
                    border: '1px solid rgba(166, 35, 65, 0.25)',
                    flexShrink: 0,
                  }}
                  title={`Logged in as ${adminDisplayName}`}
                >
                  {adminInitials}
                </div>
                <span className="admin-hide-mobile" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--admin-ink)', whiteSpace: 'nowrap' }}>
                  {adminDisplayName}
                </span>
              </div>
            </div>
          </header>

          {/* Page Outlet */}
          <main className="admin-content-area">
            <AdminErrorBoundary>
              <Outlet />
            </AdminErrorBoundary>
          </main>
        </div>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="admin-mobile-bottom-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-mobile-nav-btn ${isActive ? 'active' : ''}`}
          >
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => `admin-mobile-nav-btn ${isActive ? 'active' : ''}`}
          >
            <span className="icon">🏷️</span>
            <span>Products</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `admin-mobile-nav-btn ${isActive ? 'active' : ''}`}
          >
            <span className="icon">📦</span>
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-mobile-nav-btn ${isActive ? 'active' : ''}`}
          >
            <span className="icon">⚙️</span>
            <span>Settings</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="admin-mobile-nav-btn"
            aria-label="Open full admin menu"
          >
            <span className="icon">☰</span>
            <span>More</span>
          </button>
        </nav>

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

