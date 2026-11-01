import React, { useState, useMemo } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function OrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useAdminData();
  const showToast = useAdminToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Edit details inside order modal
  const [statusInput, setStatusInput] = useState('');
  const [courierInput, setCourierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.number.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        (o.phone && o.phone.includes(search));
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const openOrderDetail = (o) => {
    setSelectedOrder(o);
    setStatusInput(o.status || 'Pending');
    setCourierInput(o.courier || '');
    setTrackingInput(o.trackingNumber || '');
  };

  const handleStatusUpdate = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, statusInput, {
      courier: courierInput,
      trackingNumber: trackingInput,
    });
    setSelectedOrder((prev) => ({
      ...prev,
      status: statusInput,
      courier: courierInput,
      trackingNumber: trackingInput,
    }));
    showToast(`Order status updated to ${statusInput}`);
  };

  const handleDelete = (id, number) => {
    if (window.confirm(`Delete order ${number}?`)) {
      deleteOrder(id);
      setSelectedOrder(null);
      showToast('Order removed');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'Total', 'Payment Method', 'Status'];
    const rows = filteredOrders.map((o) => [
      o.number,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      o.email,
      `"${o.phone}"`,
      `"${o.total}"`,
      o.paymentMethod,
      o.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `thepaperstory-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV');
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Orders ({filteredOrders.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Track client purchases, manage courier dispatches and print packaging invoices.
          </p>
        </div>

        <button onClick={handleExportCSV} className="admin-btn admin-btn-secondary">
          📥 Export CSV
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by order #, customer name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
            style={{ flex: 1, minWidth: '280px' }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
            style={{ width: '180px' }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: '700', color: 'var(--admin-brand)' }}>{o.number}</td>
                  <td style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--admin-ink)' }}>{o.customerName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{o.phone}</div>
                  </td>
                  <td>
                    {o.items?.map((it, idx) => (
                      <div key={idx} style={{ fontSize: '13px' }}>
                        {it.productName} (x{it.quantity})
                      </div>
                    ))}
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--admin-ink)' }}>{o.total}</td>
                  <td>
                    <span className="admin-badge admin-badge-brand">{o.paymentMethod}</span>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        o.status === 'Delivered'
                          ? 'admin-badge-success'
                          : o.status === 'Processing'
                          ? 'admin-badge-warning'
                          : o.status === 'Cancelled'
                          ? 'admin-badge-danger'
                          : 'admin-badge-brand'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => openOrderDetail(o)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '680px' }}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                  Order Details — {selectedOrder.number}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--admin-muted)', marginTop: '2px' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div className="admin-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {/* Customer and Shipping Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ padding: '14px', backgroundColor: '#FAFAF9', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--admin-muted)', textTransform: 'uppercase' }}>Customer Info</h4>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--admin-ink)' }}>{selectedOrder.customerName}</div>
                  <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginTop: '4px' }}>📧 {selectedOrder.email}</div>
                  <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginTop: '2px' }}>📞 {selectedOrder.phone}</div>
                </div>

                <div style={{ padding: '14px', backgroundColor: '#FAFAF9', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--admin-muted)', textTransform: 'uppercase' }}>Delivery Address</h4>
                  <div style={{ fontSize: '13px', color: 'var(--admin-ink)', lineHeight: '1.4' }}>
                    {selectedOrder.shippingAddress}
                  </div>
                  {selectedOrder.notes && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--admin-brand)', fontStyle: 'italic' }}>
                      Note: "{selectedOrder.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '700' }}>Items in Order</h4>
                <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th style={{ textAlign: 'right' }}>Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '600' }}>{it.productName}</td>
                          <td>{it.quantity}</td>
                          <td>{it.unitPrice || '—'}</td>
                          <td style={{ textAlign: 'right', fontWeight: '700' }}>{it.lineTotal || selectedOrder.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Update & Tracking Section */}
              <div style={{ padding: '16px', backgroundColor: 'var(--admin-brand-light)', borderRadius: '10px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--admin-brand-dark)', fontWeight: '700' }}>
                  Update Fulfillment & Tracking
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="admin-label" style={{ fontSize: '12px' }}>Order Status</label>
                    <select
                      className="admin-select"
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="admin-label" style={{ fontSize: '12px' }}>Courier Service</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. TCS / Leopards"
                      value={courierInput}
                      onChange={(e) => setCourierInput(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="admin-label" style={{ fontSize: '12px' }}>Tracking #</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Tracking ID"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <button onClick={handleStatusUpdate} className="admin-btn admin-btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                    Save Status & Courier
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer" style={{ justifyContent: 'space-between' }}>
              <button onClick={() => handleDelete(selectedOrder.id, selectedOrder.number)} className="admin-btn admin-btn-danger" style={{ fontSize: '13px' }}>
                Delete Order
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsInvoiceOpen(true)} className="admin-btn admin-btn-secondary" style={{ fontSize: '13px' }}>
                  🖨️ Print Packing Invoice
                </button>
                <button onClick={() => setSelectedOrder(null)} className="admin-btn admin-btn-primary" style={{ fontSize: '13px' }}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {isInvoiceOpen && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '640px', backgroundColor: '#fff', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #A62341', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0, color: '#A62341', fontFamily: 'serif' }}>The Paper Story</h2>
                <div style={{ fontSize: '12px', color: '#7A6A6E' }}>Luxury Invitations & Bespoke Stationery</div>
                <div style={{ fontSize: '12px', color: '#7A6A6E' }}>Lahore, Pakistan • WhatsApp: +92 314 4392928</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#2B1B1F' }}>INVOICE / PACKING SLIP</h3>
                <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '4px' }}>{selectedOrder.number}</div>
                <div style={{ fontSize: '12px', color: '#7A6A6E' }}>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px', fontSize: '13px' }}>
              <strong>Ship To:</strong>
              <div>{selectedOrder.customerName}</div>
              <div style={{ whiteSpace: 'pre-line', color: '#555' }}>{selectedOrder.shippingAddress}</div>
              <div>Phone: {selectedOrder.phone}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px 0' }}>Item</th>
                  <th style={{ padding: '8px 0' }}>Qty</th>
                  <th style={{ padding: '8px 0', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((it, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0' }}>{it.productName}</td>
                    <td style={{ padding: '8px 0' }}>{it.quantity}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>{it.lineTotal || selectedOrder.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: 'right', fontSize: '15px', fontWeight: '700', marginBottom: '24px' }}>
              Grand Total: {selectedOrder.total}
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: '#7A6A6E' }}>
              Thank you for trusting The Paper Story with your celebrations!
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsInvoiceOpen(false)} className="admin-btn admin-btn-secondary">Close</button>
              <button onClick={printInvoice} className="admin-btn admin-btn-primary">Print Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

