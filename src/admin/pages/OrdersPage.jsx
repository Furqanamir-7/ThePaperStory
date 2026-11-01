import React, { useState, useMemo } from 'react';
import { useAdminData } from '../AdminDataContext';
import { useAdminToast } from '../AdminLayout';

export default function OrdersPage() {
  const { orders, updateOrderStatus, addOrder, deleteOrder, products = [] } = useAdminData();
  const showToast = useAdminToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Manual Order Creation Modal State
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const generateOrderNumber = () => {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `TPS-${yy}${mm}-${rnd}`;
  };

  const initialNewOrderState = () => ({
    number: generateOrderNumber(),
    customerName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    items: [{ productName: '', quantity: 1, unitPrice: '', lineTotal: '' }],
    total: '',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    status: 'Confirmed',
    courier: 'TCS Express',
    trackingNumber: '',
    notes: '',
  });

  const [newOrder, setNewOrder] = useState(initialNewOrderState);

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

  // Add Item in New Order form
  const handleAddItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, unitPrice: '', lineTotal: '' }],
    }));
  };

  const handleRemoveItem = (index) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewOrder((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };

      // Auto-compute lineTotal if numeric price and qty
      const qty = parseInt(updated[index].quantity, 10) || 1;
      const rawPrice = String(updated[index].unitPrice).replace(/[^0-9.]/g, '');
      const priceNum = parseFloat(rawPrice);
      if (!isNaN(priceNum) && priceNum > 0) {
        updated[index].lineTotal = `PKR ${(priceNum * qty).toLocaleString()}`;
      }

      // Auto-compute overall total
      let sum = 0;
      let hasValidPrice = false;
      for (const item of updated) {
        const itemP = parseFloat(String(item.unitPrice).replace(/[^0-9.]/g, ''));
        const itemQ = parseInt(item.quantity, 10) || 1;
        if (!isNaN(itemP) && itemP > 0) {
          sum += itemP * itemQ;
          hasValidPrice = true;
        }
      }

      return {
        ...prev,
        items: updated,
        total: hasValidPrice ? `PKR ${sum.toLocaleString()}` : prev.total,
      };
    });
  };

  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }
    if (!newOrder.phone.trim()) {
      alert('Please enter a customer phone or WhatsApp number.');
      return;
    }

    const cleanedItems = newOrder.items
      .filter((it) => it.productName.trim())
      .map((it) => ({
        productName: it.productName.trim(),
        quantity: parseInt(it.quantity, 10) || 1,
        unitPrice: it.unitPrice || 'Custom',
        lineTotal: it.lineTotal || (it.unitPrice ? `${it.unitPrice}` : 'Custom'),
      }));

    const finalOrder = {
      ...newOrder,
      items: cleanedItems.length ? cleanedItems : [{ productName: 'Custom Bespoke Stationery Order', quantity: 1, unitPrice: newOrder.total || 'Custom', lineTotal: newOrder.total || 'Custom' }],
      total: newOrder.total.trim() ? (newOrder.total.startsWith('PKR') ? newOrder.total : `PKR ${newOrder.total}`) : 'PKR 0',
      createdAt: new Date().toISOString(),
    };

    addOrder(finalOrder);
    setIsAddOrderOpen(false);
    setNewOrder(initialNewOrderState());
    showToast(`Order ${finalOrder.number} created successfully!`);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--admin-ink)', fontFamily: 'serif' }}>
            Orders ({filteredOrders.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
            Track client purchases, record manual WhatsApp orders, manage courier dispatches and print packaging invoices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => {
              setNewOrder(initialNewOrderState());
              setIsAddOrderOpen(true);
            }}
            className="admin-btn admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>➕</span> Add Manual Order
          </button>
          <button onClick={handleExportCSV} className="admin-btn admin-btn-secondary">
            📥 Export CSV
          </button>
        </div>
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-muted)' }}>
                    No orders found matching your search. Click <strong>Add Manual Order</strong> to record a new client order.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Order Creation Modal */}
      {isAddOrderOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '720px', width: '95%' }}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--admin-ink)' }}>
                  Add Manual Order
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--admin-muted)', marginTop: '2px' }}>
                  Record a client order taken via WhatsApp, phone, or in-person consultation.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOrderOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--admin-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit}>
              <div className="admin-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', padding: '20px' }}>
                {/* Top Quick Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Order Number
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newOrder.number}
                      onChange={(e) => setNewOrder({ ...newOrder, number: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Order Status
                    </label>
                    <select
                      className="admin-select"
                      value={newOrder.status}
                      onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Payment Status
                    </label>
                    <select
                      className="admin-select"
                      value={newOrder.paymentStatus}
                      onChange={(e) => setNewOrder({ ...newOrder, paymentStatus: e.target.value })}
                    >
                      <option value="Advance Paid">Advance Paid (50%)</option>
                      <option value="Paid">Fully Paid</option>
                      <option value="Unpaid">Unpaid / COD</option>
                    </select>
                  </div>
                </div>

                {/* Customer Information Card */}
                <div style={{ padding: '16px', backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #E8E0D5', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: 'var(--admin-brand)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Customer Details
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ayesha Khan"
                        className="admin-input"
                        value={newOrder.customerName}
                        onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +92 300 1234567"
                        className="admin-input"
                        value={newOrder.phone}
                        onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ayesha@gmail.com"
                        className="admin-input"
                        value={newOrder.email}
                        onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        placeholder="House / Street, Area, City"
                        className="admin-input"
                        value={newOrder.shippingAddress}
                        onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Items Card */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--admin-ink)' }}>
                      Order Items
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      + Add Item Row
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8F7F6', borderBottom: '1px solid var(--admin-border)' }}>
                          <th style={{ padding: '8px 10px', textAlign: 'left' }}>Item / Design</th>
                          <th style={{ padding: '8px 10px', width: '80px', textAlign: 'center' }}>Qty</th>
                          <th style={{ padding: '8px 10px', width: '120px', textAlign: 'left' }}>Unit Price</th>
                          <th style={{ padding: '8px 10px', width: '120px', textAlign: 'right' }}>Total</th>
                          <th style={{ padding: '8px 10px', width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {newOrder.items.map((it, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="text"
                                placeholder="e.g. Royal Mughal Botanical Suite (x200)"
                                className="admin-input"
                                value={it.productName}
                                onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                                style={{ fontSize: '13px', padding: '6px 10px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="number"
                                min="1"
                                className="admin-input"
                                value={it.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                style={{ fontSize: '13px', textAlign: 'center', padding: '6px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <input
                                type="text"
                                placeholder="450"
                                className="admin-input"
                                value={it.unitPrice}
                                onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                                style={{ fontSize: '13px', padding: '6px 10px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600' }}>
                              {it.lineTotal || '-'}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              {newOrder.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  style={{ background: 'none', border: 'none', color: '#c00', cursor: 'pointer', fontSize: '16px' }}
                                  title="Remove item"
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financials & Courier */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Grand Total (PKR) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PKR 45,000"
                      className="admin-input"
                      value={newOrder.total}
                      onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Payment Method
                    </label>
                    <select
                      className="admin-select"
                      value={newOrder.paymentMethod}
                      onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    >
                      <option value="Bank Transfer">Bank Transfer (Meezan / HBL / Alfalah)</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                      <option value="WhatsApp / Cash">WhatsApp / Direct Cash</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TCS Express / Leopard / Trax"
                      className="admin-input"
                      value={newOrder.courier}
                      onChange={(e) => setNewOrder({ ...newOrder, courier: e.target.value })}
                    />
                  </div>
                </div>

                {/* Notes & Tracking */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Courier Tracking # (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TCS-8921827"
                      className="admin-input"
                      value={newOrder.trackingNumber}
                      onChange={(e) => setNewOrder({ ...newOrder, trackingNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--admin-ink)', marginBottom: '4px' }}>
                      Special Customization Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Couple names, event date, wax seal color..."
                      className="admin-input"
                      value={newOrder.notes}
                      onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer" style={{ justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddOrderOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save & Record Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

              {/* Order Items Table */}
              <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: 'var(--admin-ink)' }}>Ordered Items</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-border)', textAlign: 'left', color: 'var(--admin-muted)' }}>
                    <th style={{ padding: '8px 0' }}>Item Name</th>
                    <th style={{ padding: '8px 0', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 0', fontWeight: '500' }}>{it.productName}</td>
                      <td style={{ padding: '10px 0', textAlign: 'center' }}>{it.quantity}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '700' }}>{it.lineTotal || selectedOrder.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Status & Courier update */}
              <div style={{ padding: '16px', backgroundColor: '#FAFAF9', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--admin-muted)', textTransform: 'uppercase' }}>
                  Update Fulfillment & Tracking
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Status</label>
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
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Courier Service</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. TCS / Leopard"
                      value={courierInput}
                      onChange={(e) => setCourierInput(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Tracking Number</label>
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
