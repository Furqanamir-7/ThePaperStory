import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function DashboardPage() {
  const { products, orders = [], reviews = [], deals = [], deleteReview } = useAdminData();
  const showToast = useAdminToast();
  const [chartRange, setChartRange] = useState('30d');

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing');
  const activeDeals = deals.filter((d) => d.active);

  const totalRevenue = orders.reduce((sum, o) => {
    const num = parseInt(String(o.total || '0').replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(id);
      showToast('Review removed');
    }
  };

  return (
    <div>
      {/* Greeting Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Welcome back, Fatima Huzefa
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--admin-muted)' }}>
            Here is your store summary and order activity for today.
          </p>
        </div>

        {/* Quick action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/products" className="admin-btn admin-btn-primary">
            + Add Product
          </Link>
          <Link to="/admin/orders" className="admin-btn admin-btn-secondary">
            📦 Orders ({orders.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '8px' }}>Total Revenue</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--admin-ink)' }}>PKR {totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: orders.length > 0 ? 'var(--admin-success)' : 'var(--admin-muted)', marginTop: '4px', fontWeight: '600' }}>
            {orders.length > 0 ? '↑ Live order total' : 'No orders yet'}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '8px' }}>Total Orders</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--admin-ink)' }}>{orders.length}</div>
          <div style={{ fontSize: '12px', color: orders.length > 0 ? 'var(--admin-success)' : 'var(--admin-muted)', marginTop: '4px', fontWeight: '600' }}>
            {orders.length > 0 ? `${orders.length} orders placed` : '0 new this week'}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '8px' }}>Pending Orders</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: pendingOrders.length > 0 ? 'var(--admin-brand)' : 'var(--admin-ink)' }}>{pendingOrders.length}</div>
          <div style={{ fontSize: '12px', color: pendingOrders.length > 0 ? 'var(--admin-warning)' : 'var(--admin-muted)', marginTop: '4px', fontWeight: '600' }}>
            {pendingOrders.length > 0 ? 'Requires fulfillment' : 'All orders fulfilled'}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '8px' }}>Total Products</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--admin-ink)' }}>{products.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--admin-muted)', marginTop: '4px' }}>Across all categories</div>
        </div>

        <div className="admin-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '8px' }}>Average Rating</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--admin-ink)' }}>4.95 ★</div>
          <div style={{ fontSize: '12px', color: 'var(--admin-muted)', marginTop: '4px' }}>From {reviews.length} reviews</div>
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="admin-dashboard-analytics" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Revenue Overview</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--admin-border)',
                    background: chartRange === range ? 'var(--admin-brand-light)' : '#fff',
                    color: chartRange === range ? 'var(--admin-brand)' : 'var(--admin-muted)',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Clean stylized SVG Bar Chart */}
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '14px', paddingTop: '20px' }}>
            {[45, 60, 35, 75, 90, 65, 80, 95, 110, 85, 120, 105].map((val, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${val * 1.3}px`,
                    backgroundColor: idx === 10 ? 'var(--admin-brand)' : 'var(--admin-brand-light)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Week ${idx + 1}: PKR ${(val * 1000).toLocaleString()}`}
                />
                <span style={{ fontSize: '10px', color: 'var(--admin-muted)' }}>W{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status Donut */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700' }}>Orders by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-badge admin-badge-warning">Processing</span>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>1 order</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-badge admin-badge-brand">Confirmed</span>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>1 order</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-badge admin-badge-success">Delivered</span>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>14 orders</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-badge admin-badge-neutral">Completed</span>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>22 orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Orders & Latest Reviews */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '20px' }}>
        {/* Recent Orders */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '13px', color: 'var(--admin-brand)', textDecoration: 'none', fontWeight: '600' }}>
              View all →
            </Link>
          </div>

          <div className="admin-table-container">
            {orders.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                📦 No active orders yet. New store orders placed by customers will appear here automatically.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '600' }}>{order.number}</td>
                      <td>{order.customerName}</td>
                      <td style={{ fontWeight: '600' }}>{order.total}</td>
                      <td>
                        <span className={`admin-badge ${order.status === 'Processing' ? 'admin-badge-warning' : 'admin-badge-success'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Latest Reviews</h3>
            <Link to="/admin/reviews" style={{ fontSize: '13px', color: 'var(--admin-brand)', textDecoration: 'none', fontWeight: '600' }}>
              Manage →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.slice(0, 4).map((r) => (
              <div
                key={r.id}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#FAFAF9',
                  border: '1px solid var(--admin-border)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>{r.customerName}</span>
                  <span style={{ color: 'var(--admin-gold)', fontSize: '12px' }}>{'★'.repeat(r.rating)}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)', lineHeight: '1.4' }}>
                  "{r.text}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#9E8E92' }}>
                  <span>{r.productName}</span>
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

