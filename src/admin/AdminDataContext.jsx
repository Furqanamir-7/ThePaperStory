import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import importedGallery from '../data/imported-desktop-gallery.json';
import { SEO_WEDDING } from '../data/seo-product-names';
import { ACCESSORIES_ADDONS_GALLERY, products as codebaseProducts, shopCategories } from '../data/products';
import { stripAutoAddedDetails } from '../data/product-metadata';
import { syncCatalogToSupabase, fetchCatalogFromSupabase } from '../utils/supabase';

const AdminDataContext = createContext(null);

const STORAGE_KEY = 'tps_admin_data_v3';
const LEGACY_STORAGE_KEY_V2 = 'tps_admin_data_v2';
const LEGACY_STORAGE_KEY = 'tps_admin_data_v1';
const AUTH_KEY = 'tps_admin_session';
const PASS_HASH_KEY = 'tps_admin_pass_hash';

// Default initial seeded password is "TPS-786"
const DEFAULT_PASSWORD = 'TPS-786';

const DEFAULT_CATEGORIES = (shopCategories || []).map((cat, idx) => ({
  id: cat.id || `cat-${idx + 1}`,
  name: cat.label || cat.name,
  slug: cat.slug,
  description: cat.description || `${cat.label} collection`,
  position: idx + 1,
  visible: true,
  subcategories: cat.subcategories || [],
}));

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
    instructions: 'Transfer the 50% advance order amount to our official HBL bank account and send receipt on WhatsApp.',
    accountDetails: 'Bank: HBL (Habib Bank Limited) | Title: Fatima Ahsan | Account #: 50097918251603 | IBAN: PK33HABB0050097918251603 | Lahore, Pakistan',
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
  heroDesktopVideo: '/hero-section.mp4',
  heroMobileVideo: '/hero-showcase-mobile.mp4',
  heroDesktopZoom: 100,
  heroMobileZoom: 100,
  heroOverlayDarkness: 20,
  googleAnalyticsId: '',
  metaPixelId: '',
};

function seedInitialProducts() {
  const list = [];

  if (codebaseProducts && Array.isArray(codebaseProducts) && codebaseProducts.length > 0) {
    codebaseProducts.forEach((p, idx) => {
      const code = p.code || p.sku || `TPS-${p.id}`;
      const numPrice = p.price ? Number(String(p.price).replace(/[^0-9.]/g, '')) || 0 : 0;
      list.push({
        id: `prod-${p.id || idx}`,
        code: code,
        sku: code,
        designNumber: p.designNumber || null,
        name: p.name || `Product ${code}`,
        slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${code}`),
        category: p.category || 'Stationery',
        categorySlug: p.categorySlug || 'wedding-invitations',
        categoryId: p.categorySlug || 'cat-1',
        subcategory: p.subcategory || null,
        subcategorySlug: p.subcategorySlug || null,
        price: p.showPrice && p.price ? p.price : 'Price on Request',
        numericPrice: numPrice,
        salePrice: null,
        stock: 50,
        status: 'Active',
        featured: Boolean(p.featured || (p.designNumber && p.designNumber <= 6)),
        isNew: Boolean(p.isNew),
        type: p.categorySlug === 'digital-invitations' ? 'digital' : 'physical',
        description: stripAutoAddedDetails(p.description || ''),
        shortDescription: p.shortDescription || p.description?.slice(0, 120) || '',
        whatsIncluded: p.whatsIncluded || [],
        seoKeywords: p.seoKeywords || [],
        images: p.images || (p.image ? [p.image] : []),
        badge: p.badge || null,
        rating: 5.0,
        reviewCount: 3,
        createdAt: new Date().toISOString(),
      });
    });
    return list;
  }

  // Fallback if codebaseProducts is not loaded
  return [];
}

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY_V2) ||
        localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.settings = { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) };

        // Ensure all DEFAULT_CATEGORIES (especially cat-5 Premium Add-ons) exist in categories
        if (parsed.categories && Array.isArray(parsed.categories)) {
          const catSlugs = new Set(parsed.categories.map((c) => c.slug));
          DEFAULT_CATEGORIES.forEach((dc) => {
            if (!catSlugs.has(dc.slug)) {
              parsed.categories.push(dc);
            }
          });
        } else {
          parsed.categories = DEFAULT_CATEGORIES;
        }

        const seeded = seedInitialProducts();
        const existingById = new Map();
        const existingByCode = new Map();
        (parsed.products || []).forEach((p) => {
          if (p.id) existingById.set(String(p.id), p);
          if (p.code) existingByCode.set(String(p.code).toUpperCase(), p);
          if (p.sku) existingByCode.set(String(p.sku).toUpperCase(), p);
        });

        // Always guarantee all 228 seeded products exist, while strictly preserving any edits made by the client or user
        const mergedProducts = seeded.map((s) => {
          const sCode = (s.code || s.sku || '').toUpperCase();
          const existing = existingById.get(String(s.id)) || existingByCode.get(sCode);
          if (existing) {
            const isFavour = s.categorySlug === 'favours';
            return {
              ...s,
              ...existing, // PRESERVES ALL CLIENT EDITS (description, price, images, custom options, etc.)
              id: s.id,
              code: s.code, // Always enforce unique authoritative code
              sku: s.sku || s.code,
              name: (isFavour && (!existing.updatedAt || existing.name?.includes('Design') || existing.name?.includes('Customised'))) ? s.name : (existing.name || s.name),
              categorySlug: s.categorySlug || existing.categorySlug,
            };
          }
          return s;
        });

        // Also preserve any manually added custom products from admin panel
        const seededIds = new Set(seeded.map((s) => String(s.id)));
        const userCreatedProducts = (parsed.products || []).filter(
          (p) => p.id && !seededIds.has(String(p.id))
        );

        parsed.products = [...mergedProducts, ...userCreatedProducts];

        // Build lookup map for latest code-defined add-ons to refresh names and media
        const addonLookup = {};
        if (ACCESSORIES_ADDONS_GALLERY && Array.isArray(ACCESSORIES_ADDONS_GALLERY)) {
          ACCESSORIES_ADDONS_GALLERY.forEach((item, idx) => {
            const num = idx + 1;
            const code = (item.code || `TPS-ACC-${String(num).padStart(2, '0')}`).toLowerCase();
            addonLookup[code] = item;
            if (item.slug) addonLookup[item.slug.toLowerCase()] = item;
            addonLookup[`prod-acc-${num}`] = item;
          });
        }

        // Upgrade, synchronize and normalize all products
        if (parsed.products && Array.isArray(parsed.products)) {
          parsed.products = parsed.products.map((p) => {
            const sku = p.sku || p.code;
            const match = (sku || p.id || '').match(/TPS-WI-(\d+)/i) || (p.images?.[0] || '').match(/wedding-invites\/design-(\d+)/i);
            const num = match ? Number(match[1]) : (p.designNumber || null);
            const resolvedCode = p.code || sku || (num ? `TPS-WI-${String(num).padStart(2, '0')}` : null);
            const resolvedCategorySlug = p.categorySlug || (num ? 'wedding-invitations' : undefined);
            const updated = {
              ...p,
              code: resolvedCode || p.code,
              sku: sku || resolvedCode,
              ...(resolvedCategorySlug ? { categorySlug: resolvedCategorySlug } : {}),
              ...(num ? { designNumber: num } : {}),
            };

            // Synchronize wedding names
            if (num && SEO_WEDDING[num] && (!p.name || /^Design \d+$/i.test(p.name) || /^Luxury Wedding Suite/i.test(p.name) || /^Wedding Invitation Design/i.test(p.name))) {
              updated.name = SEO_WEDDING[num];
            }

            // Synchronize Add-ons with fresh codebase media and names without overwriting admin edits
            const pKey = (resolvedCode || sku || p.slug || p.id || '').toLowerCase();
            if (addonLookup[pKey]) {
              const fresh = addonLookup[pKey];
              updated.name = p.name || fresh.name;
              updated.images = (p.images && p.images.length > 0) ? p.images : fresh.images;
              updated.description = p.description || fresh.description;
              updated.category = 'Premium Add-ons';
              updated.categorySlug = 'accessories-add-ons';
              updated.categoryId = 'cat-5';
              if (fresh.badge && !p.badge) updated.badge = fresh.badge;
            }

            return updated;
          });
        }
        // Clear any demo orders from stored local data
        parsed.orders = (parsed.orders || []).filter(
          (o) => o.id !== 'ord-101' && o.id !== 'ord-102'
        );

        return parsed;
      }
    } catch (e) {
      console.warn('Could not read admin data from localStorage:', e);
    }

    return {
      products: seedInitialProducts(),
      categories: DEFAULT_CATEGORIES,
      orders: [],
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

  // Cloud synchronization state
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'offline'
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const syncTimerRef = useRef(null);
  const isSyncingRef = useRef(false);
  const hasUserModifiedRef = useRef(false);
  const lastRemoteUpdatedAtRef = useRef(null);

  // Push to Supabase with API fallback
  const pushToCloud = useCallback(async (currentData) => {
    try {
      setSyncStatus('syncing');

      // 1. Try Supabase live sync
      const sbResult = await syncCatalogToSupabase(currentData);
      if (sbResult.success) {
        setSyncStatus('supabase');
        setLastSyncedAt(new Date().toISOString());
        return;
      }

      // 2. Fallback to /api/admin-data
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: currentData, updatedBy: 'admin' }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSyncStatus('synced');
          setLastSyncedAt(json.updatedAt || new Date().toISOString());
          return;
        }
      }

      setSyncStatus('offline');
    } catch (err) {
      console.warn('Admin cloud sync note:', err);
      setSyncStatus('offline');
    }
  }, []);

  // Background pull from Supabase with /api/admin-data fallback
  const pullFromCloud = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      let remote = null;
      let remoteUpdatedAt = null;
      let isFromSupabase = false;

      // 1. Try Supabase first
      const sbRes = await fetchCatalogFromSupabase();
      if (sbRes.success && sbRes.data) {
        remote = sbRes.data;
        remoteUpdatedAt = sbRes.updatedAt;
        isFromSupabase = true;
      } else {
        // 2. Fallback to /api/admin-data
        const res = await fetch('/api/admin-data', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.exists && json.data) {
            remote = json.data;
            remoteUpdatedAt = json.updatedAt;
          }
        }
      }

      if (remote) {
        if (remoteUpdatedAt && remoteUpdatedAt === lastRemoteUpdatedAtRef.current && !hasUserModifiedRef.current) {
          setSyncStatus(isFromSupabase ? 'supabase' : 'synced');
          return;
        }
        lastRemoteUpdatedAtRef.current = remoteUpdatedAt;

        setData((prev) => {
          const seeded = seedInitialProducts();
          const existingById = new Map();
          const existingByCode = new Map();

          // Populate from remote products
          (remote.products || prev.products || []).forEach((p) => {
            if (p.id) existingById.set(String(p.id), p);
            if (p.code) existingByCode.set(String(p.code).toUpperCase(), p);
            if (p.sku) existingByCode.set(String(p.sku).toUpperCase(), p);
          });

          // Preserve any unpushed local client modifications (products with updatedAt)
          (prev.products || []).forEach((p) => {
            const id = String(p.id);
            const code = (p.code || p.sku || '').toUpperCase();
            if (p.updatedAt) {
              const existing = existingById.get(id) || (code && existingByCode.get(code));
              if (!existing?.updatedAt || new Date(p.updatedAt) > new Date(existing.updatedAt)) {
                existingById.set(id, p);
                if (code) existingByCode.set(code, p);
              }
            } else if (code === 'TPS-WI-01') {
              existingByCode.set(code, p);
            }
          });

          const merged = seeded.map((s) => {
            const sCode = (s.code || s.sku || '').toUpperCase();
            const existing = existingById.get(String(s.id)) || existingByCode.get(sCode);
            if (existing) {
              const isFavour = s.categorySlug === 'favours';
              return {
                ...s,
                ...existing,
                id: s.id,
                code: s.code, // Always enforce unique authoritative code
                sku: s.sku || s.code,
                name: (isFavour && (!existing.updatedAt || existing.name?.includes('Design') || existing.name?.includes('Customised'))) ? s.name : (existing.name || s.name),
              };
            }
            return s;
          });

          const seededIds = new Set(seeded.map((s) => String(s.id)));
          const customProducts = (remote.products || prev.products || []).filter(
            (p) => p.id && !seededIds.has(String(p.id))
          );

          const cleanedProducts = [...merged, ...customProducts].map((p) => ({
            ...p,
            description: stripAutoAddedDetails(p.description),
          }));

          const cleanedOrders = (remote.orders || prev.orders || []).filter(
            (o) => o.id !== 'ord-101' && o.id !== 'ord-102'
          );

          const updated = {
            ...prev,
            ...remote,
            products: cleanedProducts,
            orders: cleanedOrders,
            categories: remote.categories || prev.categories,
            settings: { ...DEFAULT_SETTINGS, ...(remote.settings || prev.settings) },
          };

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {}

          return updated;
        });

        setSyncStatus(isFromSupabase ? 'supabase' : 'synced');
        setLastSyncedAt(new Date().toISOString());
      } else {
        // If first boot or both returned empty, push current state so others get it
        setSyncStatus('offline');
        await pushToCloud(data);
      }
    } catch (e) {
      console.warn('Could not pull from admin cloud:', e);
      setSyncStatus('offline');
    } finally {
      isSyncingRef.current = false;
    }
  }, [data, pushToCloud]);

  // Initial pull and periodic auto-sync
  useEffect(() => {
    pullFromCloud();

    const handleFocus = () => pullFromCloud();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      pullFromCloud();
    }, 25000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [pullFromCloud]);

  // Save to localStorage on change and debounced push to cloud when user modifies data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed saving admin data to localStorage:', e);
    }

    // Only push to cloud when user actively makes a local modification
    if (!hasUserModifiedRef.current) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      pushToCloud(data);
      hasUserModifiedRef.current = false;
    }, 600);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [data, pushToCloud]);

  // Product CRUD
  const addProduct = (prod) => {
    hasUserModifiedRef.current = true;
    const newProd = {
      ...prod,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, products: [newProd, ...prev.products] }));
    return newProd;
  };

  const updateProduct = (id, updates) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  };

  const deleteProduct = (id) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const bulkDeleteProducts = (ids) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => !ids.includes(p.id)),
    }));
  };

  // Category CRUD
  const addCategory = (cat) => {
    hasUserModifiedRef.current = true;
    const newCat = { ...cat, id: `cat-${Date.now()}` };
    setData((prev) => ({ ...prev, categories: [...prev.categories, newCat] }));
  };

  const updateCategory = (id, updates) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const deleteCategory = (id) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  };

  // Orders CRUD
  const updateOrderStatus = (id, status, extra = {}) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === id ? { ...o, status, ...extra } : o)),
    }));
  };

  const addOrder = (order) => {
    hasUserModifiedRef.current = true;
    const newOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, orders: [newOrder, ...prev.orders] }));
    return newOrder;
  };

  const deleteOrder = (id) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      orders: prev.orders.filter((o) => o.id !== id),
    }));
  };

  // Reviews CRUD
  const addReview = (rev) => {
    hasUserModifiedRef.current = true;
    const newRev = { ...rev, id: `rev-${Date.now()}`, date: new Date().toISOString().slice(0, 10) };
    setData((prev) => ({ ...prev, reviews: [newRev, ...prev.reviews] }));
  };

  const updateReview = (id, updates) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  };

  const deleteReview = (id) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
    }));
  };

  // Deals CRUD
  const addDeal = (deal) => {
    hasUserModifiedRef.current = true;
    const newDeal = { ...deal, id: `deal-${Date.now()}` };
    setData((prev) => ({ ...prev, deals: [newDeal, ...prev.deals] }));
  };

  const updateDeal = (id, updates) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      deals: prev.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const deleteDeal = (id) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      deals: prev.deals.filter((d) => d.id !== id),
    }));
  };

  // Marquee
  const updateMarquee = (marqueeUpdates) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      marquee: { ...prev.marquee, ...marqueeUpdates },
    }));
  };

  // Payments
  const addPaymentMethod = (pm) => {
    hasUserModifiedRef.current = true;
    const newPm = { ...pm, id: `pay-${Date.now()}` };
    setData((prev) => ({ ...prev, payments: [...prev.payments, newPm] }));
  };

  const updatePaymentMethod = (id, updates) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deletePaymentMethod = (id) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      payments: prev.payments.filter((p) => p.id !== id),
    }));
  };

  // Media
  const addMedia = (url) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      media: [url, ...prev.media.filter((m) => m !== url)],
    }));
  };

  const deleteMedia = (url) => {
    hasUserModifiedRef.current = true;
    setData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m !== url),
    }));
  };

  // Settings
  const updateSettings = (updates) => {
    hasUserModifiedRef.current = true;
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

  const syncCatalogProducts = () => {
    const freshSeeded = seedInitialProducts();

    setData((prev) => {
      const existingById = new Map();
      (prev.products || []).forEach((p) => {
        if (p.id) existingById.set(String(p.id), p);
      });

      const updatedProducts = freshSeeded.map((s) => {
        const existing = existingById.get(String(s.id));
        if (existing) {
          return {
            ...s,
            price: existing.price ?? s.price,
            numericPrice: existing.numericPrice ?? s.numericPrice,
            salePrice: existing.salePrice ?? s.salePrice,
            stock: existing.stock ?? s.stock,
            status: existing.status ?? s.status,
            featured: existing.featured ?? s.featured,
          };
        }
        return s;
      });

      // Preserve custom created products from admin panel
      const seededIds = new Set(freshSeeded.map((s) => String(s.id)));
      const customOnes = (prev.products || []).filter((p) => p.id && !seededIds.has(String(p.id)));

      // Also ensure all DEFAULT_CATEGORIES exist
      const existingCatSlugs = new Set((prev.categories || []).map((c) => c.slug));
      const newCategories = [...(prev.categories || [])];
      DEFAULT_CATEGORIES.forEach((dc) => {
        if (!existingCatSlugs.has(dc.slug)) {
          newCategories.push(dc);
        }
      });

      const nextData = {
        ...prev,
        categories: newCategories,
        products: [...updatedProducts, ...customOnes],
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) {}

      return nextData;
    });
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

  const importAllData = async (importedData) => {
    if (!importedData || typeof importedData !== 'object') {
      throw new Error('Invalid backup file format');
    }
    const nextData = {
      ...data,
      ...importedData,
      products: Array.isArray(importedData.products) ? importedData.products : data.products,
      categories: Array.isArray(importedData.categories) ? importedData.categories : data.categories,
      settings: { ...DEFAULT_SETTINGS, ...(importedData.settings || data.settings || {}) },
    };
    setData(nextData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    } catch (e) {}
    await pushToCloud(nextData);
    return true;
  };

  return (
    <AdminDataContext.Provider
      value={{
        ...data,
        syncStatus,
        lastSyncedAt,
        refreshAdminData: pullFromCloud,
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
        importAllData,
        syncCatalogProducts,
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

