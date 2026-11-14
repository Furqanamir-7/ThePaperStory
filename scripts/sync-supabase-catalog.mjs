import { products } from '../src/data/products.js';
import { stripAutoAddedDetails } from '../src/data/product-metadata.js';

const supabaseUrl = 'https://cldmkkbrovisonhgugvl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZG1ra2Jyb3Zpc29uaGd1Z3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODQwODUsImV4cCI6MjEwODk2MDA4NX0.Bk6Xk5MC-X6fmxbrDepYdfIbCDcZKtM_cL2ieeu-6bg';

async function sync() {
  console.log('🔄 Fetching current store_catalog from Supabase...');
  const res = await fetch(`${supabaseUrl}/rest/v1/store_catalog?id=eq.live_store_catalog&select=id,data,updated_at`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  const rows = await res.json();
  const currentCatalog = (rows && rows[0]?.data) || {};

  console.log(`Current catalog has ${currentCatalog.products?.length || 0} products in DB.`);

  // Build the fresh 228 products with their unique codes and SEO names
  const existingById = new Map();
  (currentCatalog.products || []).forEach((p) => {
    if (p.id) existingById.set(String(p.id), p);
  });

  const updatedProducts = products.map((p) => {
    const existing = existingById.get(String(p.id));
    const numPrice = p.showPrice && p.price ? parseInt(String(p.price).replace(/[^0-9]/g, ''), 10) || 500 : 0;
    
    return {
      id: p.id,
      code: p.code,
      sku: p.sku || p.code,
      designNumber: p.designNumber,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: p.category || 'Stationery',
      categorySlug: p.categorySlug || 'wedding-invitations',
      categoryId: p.categorySlug || 'cat-1',
      subcategory: p.subcategory || null,
      subcategorySlug: p.subcategorySlug || null,
      price: existing?.price || (p.showPrice && p.price ? p.price : 'Price on Request'),
      numericPrice: existing?.numericPrice ?? numPrice,
      salePrice: existing?.salePrice || null,
      stock: existing?.stock ?? 50,
      status: existing?.status || 'Active',
      featured: existing?.featured ?? Boolean(p.featured || (p.designNumber && p.designNumber <= 6)),
      isNew: existing?.isNew ?? Boolean(p.isNew),
      type: p.categorySlug === 'digital-invitations' ? 'digital' : 'physical',
      description: existing?.description ? stripAutoAddedDetails(existing.description) : stripAutoAddedDetails(p.description || ''),
      shortDescription: existing?.shortDescription || p.shortDescription || p.description?.slice(0, 120) || '',
      whatsIncluded: p.whatsIncluded || [],
      seoKeywords: p.seoKeywords || [],
      images: p.images || (p.image ? [p.image] : []),
      image: p.image || p.images?.[0],
      badge: existing?.badge || p.badge || null,
      rating: existing?.rating ?? 5.0,
      reviewCount: existing?.reviewCount ?? 3,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const newCatalogData = {
    ...currentCatalog,
    products: updatedProducts,
  };

  console.log(`Prepared ${updatedProducts.length} products. Pushing to Supabase...`);

  const upsertRes = await fetch(`${supabaseUrl}/rest/v1/store_catalog`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      id: 'live_store_catalog',
      data: newCatalogData,
      updated_at: new Date().toISOString(),
      updated_by: 'admin',
    }),
  });

  if (!upsertRes.ok) {
    const errText = await upsertRes.text();
    throw new Error(`Failed to update Supabase: ${upsertRes.status} ${errText}`);
  }

  const result = await upsertRes.json();
  console.log('✅ Supabase store_catalog updated successfully!');
  console.log(`Updated at: ${result[0]?.updated_at}`);

  // Verification of favours in DB
  const favours = result[0]?.data?.products?.filter((p) => p.categorySlug === 'favours');
  console.log(`\nVerified ${favours?.length} favours in Supabase:`);
  favours?.forEach((f) => console.log(`  ${f.code} : ${f.name}`));
}

sync().catch((err) => {
  console.error('❌ Sync error:', err);
  process.exit(1);
});

