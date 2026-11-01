import React, { createContext, useContext, useState, useEffect } from 'react';
import importedGallery from '../data/imported-desktop-gallery.json';

const AdminDataContext = createContext(null);

const STORAGE_KEY = 'tps_admin_data_v1';
const AUTH_KEY = 'tps_admin_session';
const PASS_HASH_KEY = 'tps_admin_pass_hash';

// Default initial seeded password is "TPS-786"
const DEFAULT_PASSWORD = 'TPS-786';

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Wedding Invitations', slug: 'wedding-invitations', description: 'Handcrafted luxury wedding suites and boxed invitations', position: 1, visible: true },
  { id: 'cat-2', name: 'Digital E-Invites', slug: 'digital-invitations', description: 'Animated, video and static phone invitations', position: 2, visible: true },
  { id: 'cat-3', name: 'Nikkah Certificates', slug: 'nikkah-certificates', description: 'Illuminated foil stamped and calligraphy certificates', position: 3, visible: true },
  { id: 'cat-4', name: 'Stationery & Favours', slug: 'stationery', description: 'Wax seals, diaries, menus, gift tags and packaging', position: 4, visible: true },
];

const DEFAULT_MARQUEE = {
  enabled: true,
  speed: 'medium',
  direction: 'left',
  pauseOnHover: true,
  bgColor: '#A62341',
  textColor: '#FFFFFF',
  items: [
    { id: 'm-1', text: 'LUXURY WEDDING INVITATIONS', active: true },
    { id: 'm-2', text: 'BESPOKE STATIONERY', active: true },
    { id: 'm-3', text: 'CUSTOM DESIGNING, PRINTING & PACKAGING', active: true },
    { id: 'm-4', text: 'WORLDWIDE SHIPPING', active: true },
    { id: 'm-5', text: 'NIKKAH CERTIFICATES', active: true },
    { id: 'm-6', text: 'ANIMATED VIDEO INVITATIONS', active: true },
    { id: 'm-7', text: 'WAX SEALS & ACCESSORIES', active: true },
  ]
};

const DEFAULT_PAYMENTS = [
  {
    id: 'pay-cod',
    name: 'Cash on Delivery (Pakistan)',
    type: 'Cash on Delivery',
    instructions: 'Pay in cash to the courier upon delivery of your parcel.',
    accountDetails: '',
    requireProof: false,
    active: true,
    displayOrder: 1,
  },
  {
    id: 'pay-bank',
    name: 'Direct Bank Transfer',
    type: 'Bank Transfer',
    instructions: 'Transfer the order amount to our business bank account and upload your receipt or send on WhatsApp.',
    accountDetails: 'Bank: Meezan Bank | Account Title: The Paper Story | IBAN: PK45MEZN0001234567890123',
    requireProof: true,
    active: true,
    displayOrder: 2,
  },
  {
    id: 'pay-wallet',
    name: 'JazzCash / Easypaisa',
    type: 'Mobile Wallet',
    instructions: 'Send money to our mobile account and provide the Transaction ID or screenshot.',
    accountDetails: 'Title: Furqan Amir | JazzCash/Easypaisa: 0314-4392928',
    requireProof: true,
    active: true,
    displayOrder: 3,
  }
];

const DEFAULT_DEALS = [
  {
    id: 'deal-1',
    title: 'Wedding Season Launch',
    code: 'WEDDING10',
    type: 'percentage',
    value: 10,
    bannerText: '✨ Enjoy 10% OFF on all luxury wedding invitation suites with code WEDDING10',
    startsAt: '2026-10-01',
    endsAt: '2026-12-31',
    active: true,
  }
];

const DEFAULT_REVIEWS = [
  { id: 'rev-1', productName: 'Royal Mughal Botanical Suite', customerName: 'Ayesha & Hamza', rating: 5, text: 'The paper quality and foil stamping exceeded all our expectations! Everyone praised our wedding cards.', date: '2026-10-24', status: 'published', verified: true },
  { id: 'rev-2', productName: 'Vintage Lace Dream Suite', customerName: 'Zainab Fatima', rating: 5, text: 'Customized exactly the way we requested. The wax seals and envelope liners were breathtaking.', date: '2026-10-20', status: 'published', verified: true },
  { id: 'rev-3', productName: 'Illuminated Nikkah Certificate', customerName: 'Bilal Tariq', rating: 5, text: 'Such an heirloom piece to keep forever. Delivered securely in a velvet folder.', date: '2026-10-15', status: 'published', verified: true },
  { id: 'rev-4', productName: 'Animated Video E-Invite', customerName: 'Maham Khan', rating: 5, text: 'Our guests absolutely loved the digital invite! Fast delivery in 24 hours.', date: '2026-10-10', status: 'published', verified: true },
];

const DEFAULT_SETTINGS = {
  storeName: 'The Paper Story',
  tagline: 'More than paper. Designed to be remembered.',
  contactEmail: 'thepaperstory.pk@gmail.com',
  whatsappNumber: '+923144392928',
  currency: 'PKR',
  orderPrefix: 'TPS',
  lowStockThreshold: 10,
  maintenanceMode: false,
};

function seedInitialProducts() {
  const products = [];
  
  // Seed from importedGallery wedding designs
  if (importedGallery?.wedding?.length) {
    importedGallery.wedding.forEach((w) => {
      const code = `TPS-WI-${String(w.designNumber).padStart(2, '0')}`;
      products.push({
        id: `prod-wi-${w.designNumber}`,
        name: w.name || `Luxury Wedding Suite ${code}`,
        slug: `wedding-invitation-${w.designNumber}`,
        sku: code,
        category: 'Wedding Invitations',
        categoryId: 'cat-1',
        price: 'Price on Request',
        numericPrice: 0,
        salePrice: null,
        stock: 50,
        status: 'Active',
        featured: w.designNumber <= 6,
        isNew: w.designNumber >= 30,
        type: 'physical',
        description: `Bespoke luxury wedding suite featuring customized gold foil calligraphy, fine imported textured stock, custom wax seal and coordinating envelope.`,
        shortDescription: 'Customized luxury wedding suite with coordinating stationery and envelope.',
        images: w.images || [],
        rating: 5.0,
        reviewCount: 3,
        createdAt: new Date().toISOString(),
      });
    });
  }

  // Seed sample stationery and digital items
  products.push(
    {
      id: 'prod-di-01',
      name: 'Pretty Floral Digital Wedding E-Card',
      slug: 'pretty-floral-digital-wedding-e-card',
      sku: 'TPS-DI-01',
      category: 'Digital E-Invites',
      categoryId: 'cat-2',
      price: 'Price on Request',
      numericPrice: 2500,
      salePrice: null,
      stock: 999,
      status: 'Active',
      featured: true,
      isNew: true,
      type: 'digital',
      description: 'Ultra high-definition digital wedding card optimized for WhatsApp sharing and mobile viewing.',
      shortDescription: 'WhatsApp ready e-card with custom music and personalized text.',
      images: ['/e-invites/wedding-static-01.png', '/e-invites/wedding-static-02.png'],
      rating: 5.0,
      reviewCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-s-01',
      name: 'Pretty Pink Tulip Spiral Mini Diary',
      slug: 'pretty-pink-tulip-spiral-mini-diary',
      sku: 'TPS-S-01',
      category: 'Stationery & Favours',
      categoryId: 'cat-4',
      price: 'PKR 1150',
      numericPrice: 1150,
      salePrice: null,
      stock: 45,
      status: 'Active',
      featured: true,
      isNew: false,
      type: 'physical',
      description: 'Handmade spiral notebook with premium lined pages and thick matte laminated cover.',
      shortDescription: 'Cute pocket spiral diary for notes and journaling.',
      images: ['/stationary/Pretty Pink Tulip Spiral Mini Diary - 1150.jpg'],
      rating: 4.8,
      reviewCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-s-02',
      name: 'Cute Hello Kitty Printed Gel Pen',
      slug: 'cute-hello-kitty-printed-gel-pen',
      sku: 'TPS-S-02',
      category: 'Stationery & Favours',
      categoryId: 'cat-4',
      price: 'PKR 250',
      numericPrice: 250,
      salePrice: null,
      stock: 120,
      status: 'Active',
      featured: false,
      isNew: false,
      type: 'physical',
      description: 'Smooth writing 0.5mm black gel pen with cute licensed character topper.',
      shortDescription: 'Kawaii fine tip gel pen.',
      images: ['/stationary/Cute Hello Kitty Printed Gel Pen - 250.jpg'],
      rating: 4.9,
      reviewCount: 5,
      createdAt: new Date().toISOString(),
    }
  );

  return products;
}

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read admin data from localStorage:', e);
    }

    return {
      products: seedInitialProducts(),
      categories: DEFAULT_CATEGORIES,
      orders: [
        {
          id: 'ord-101',
          number: 'TPS-2610-1001',
          customerName: 'Fatima Alvi',
          email: 'fatima.alvi@gmail.com',
          phone: '+92 321 4455667',
          shippingAddress: 'House 45, Street 12, DHA Phase 5, Lahore, Pakistan',
          items: [{ productName: 'Royal Mughal Botanical Suite (x200)', quantity: 200, unitPrice: 'PKR 450', lineTotal: 'PKR 90,000' }],
          total: 'PKR 90,000',
          paymentMethod: 'Bank Transfer',
          paymentStatus: 'Paid',
          status: 'Processing',
          trackingNumber: 'TCS-99281726',
          courier: 'TCS Express',
          notes: 'Deliver before 15th November',
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
        },
        {
          id: 'ord-102',
          number: 'TPS-2610-1002',
          customerName: 'Usman Ghani',
          email: 'usman.ghani@yahoo.com',
          phone: '+92 300 9876543',
          shippingAddress: 'Apartment 4B, Clifton Block 2, Karachi, Pakistan',
          items: [{ productName: 'Pretty Pink Tulip Spiral Mini Diary', quantity: 2, unitPrice: 'PKR 1150', lineTotal: 'PKR 2300' }],
          total: 'PKR 2,550',
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending',
          status: 'Confirmed',
          trackingNumber: '',
          courier: 'Call Courier',
          notes: 'Gift wrap please',
          createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
        }
      ],
      reviews: DEFAULT_REVIEWS,
      deals: DEFAULT_DEALS,
      marquee: DEFAULT_MARQUEE,
      payments: DEFAULT_PAYMENTS,
      settings: DEFAULT_SETTINGS,
      media: [
        '/wedding-invites/cover.jpg',
        '/e-invites/wedding-static-01.png',
        '/stationary/Pretty Pink Tulip Spiral Mini Diary - 1150.jpg',
      ],
    };
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed saving admin data to localStorage:', e);
    }
  }, [data]);

  // Product CRUD
  const addProduct = (prod) => {
    const newProd = {
      ...prod,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, products: [newProd, ...prev.products] }));
    return newProd;
  };

  const updateProduct = (id, updates) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deleteProduct = (id) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const bulkDeleteProducts = (ids) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => !ids.includes(p.id)),
    }));
  };

  // Category CRUD
  const addCategory = (cat) => {
    const newCat = { ...cat, id: `cat-${Date.now()}` };
    setData((prev) => ({ ...prev, categories: [...prev.categories, newCat] }));
  };

  const updateCategory = (id, updates) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const deleteCategory = (id) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  };

  // Orders CRUD
  const updateOrderStatus = (id, status, extra = {}) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === id ? { ...o, status, ...extra } : o)),
    }));
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, orders: [newOrder, ...prev.orders] }));
    return newOrder;
  };

  const deleteOrder = (id) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.filter((o) => o.id !== id),
    }));
  };

  // Reviews CRUD
  const addReview = (rev) => {
    const newRev = { ...rev, id: `rev-${Date.now()}`, date: new Date().toISOString().slice(0, 10) };
    setData((prev) => ({ ...prev, reviews: [newRev, ...prev.reviews] }));
  };

  const updateReview = (id, updates) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  };

  const deleteReview = (id) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
    }));
  };

  // Deals CRUD
  const addDeal = (deal) => {
    const newDeal = { ...deal, id: `deal-${Date.now()}` };
    setData((prev) => ({ ...prev, deals: [newDeal, ...prev.deals] }));
  };

  const updateDeal = (id, updates) => {
    setData((prev) => ({
      ...prev,
      deals: prev.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const deleteDeal = (id) => {
    setData((prev) => ({
      ...prev,
      deals: prev.deals.filter((d) => d.id !== id),
    }));
  };

  // Marquee
  const updateMarquee = (marqueeUpdates) => {
    setData((prev) => ({
      ...prev,
      marquee: { ...prev.marquee, ...marqueeUpdates },
    }));
  };

  // Payments
  const addPaymentMethod = (pm) => {
    const newPm = { ...pm, id: `pay-${Date.now()}` };
    setData((prev) => ({ ...prev, payments: [...prev.payments, newPm] }));
  };

  const updatePaymentMethod = (id, updates) => {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deletePaymentMethod = (id) => {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.filter((p) => p.id !== id),
    }));
  };

  // Media
  const addMedia = (url) => {
    setData((prev) => ({
      ...prev,
      media: [url, ...prev.media.filter((m) => m !== url)],
    }));
  };

  const deleteMedia = (url) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m !== url),
    }));
  };

  // Settings
  const updateSettings = (updates) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  };

  // Auth helper
  const verifyPassword = (password) => {
    const stored = localStorage.getItem(PASS_HASH_KEY) || DEFAULT_PASSWORD;
    return password === stored;
  };

  const changeAdminPassword = (newPassword) => {
    localStorage.setItem(PASS_HASH_KEY, newPassword);
  };

  const exportAllData = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thepaperstory-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminDataContext.Provider
      value={{
        ...data,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        addOrder,
        deleteOrder,
        addReview,
        updateReview,
        deleteReview,
        addDeal,
        updateDeal,
        deleteDeal,
        updateMarquee,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        addMedia,
        deleteMedia,
        updateSettings,
        verifyPassword,
        changeAdminPassword,
        exportAllData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
}

