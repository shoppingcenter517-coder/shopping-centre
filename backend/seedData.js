const Product = require('./models/Product');

// Images frontend/public/images/products/ me hain (internet ki zaroorat nahi)
const img = (slug) => `/images/products/${slug}.svg`;

// [name, category, price, stock, description]
// stock 0 = out of stock  (men: 3, women: 3 => total 6 out of stock, 22 in stock)
const data = [
  // ---------- MEN (14) ----------
  ['Classic White Shirt', 'men', 899, 15, 'Cotton formal shirt, regular fit'],
  ['Slim Fit Blue Jeans', 'men', 1299, 20, 'Stretchable denim, slim fit'],
  ['Black Polo T-Shirt', 'men', 599, 25, 'Soft pique cotton polo'],
  ['Casual Hoodie', 'men', 1499, 10, 'Fleece hoodie with front pocket'],
  ['Formal Trousers', 'men', 1099, 12, 'Wrinkle-free office trousers'],
  ['Denim Jacket', 'men', 1999, 0, 'Classic blue denim jacket'],
  ['Cotton Kurta', 'men', 799, 0, 'Festive cotton kurta'],
  ['Sports Track Pants', 'men', 699, 18, 'Lightweight track pants for gym'],
  ['Checked Casual Shirt', 'men', 849, 14, 'Full sleeve checked shirt'],
  ['Running Shoes', 'men', 2299, 9, 'Cushioned sole running shoes'],
  ['Leather Wallet', 'men', 499, 0, 'Genuine leather bi-fold wallet'],
  ['Analog Wrist Watch', 'men', 1799, 7, 'Stainless steel analog watch'],
  ['Round Neck T-Shirt', 'men', 399, 30, '100% cotton round neck tee'],
  ['Cargo Shorts', 'men', 749, 16, 'Multi-pocket cotton shorts'],

  // ---------- WOMEN (14) ----------
  ['Floral Summer Dress', 'women', 1399, 11, 'Light and breezy floral dress'],
  ['Cotton Kurti', 'women', 649, 22, 'Printed straight-cut kurti'],
  ['High Waist Jeans', 'women', 1399, 17, 'Stretch denim high waist jeans'],
  ['Printed Palazzo', 'women', 549, 19, 'Comfortable printed palazzo pants'],
  ['Silk Saree', 'women', 2999, 0, 'Festive silk saree with blouse piece'],
  ['Casual Top', 'women', 449, 28, 'Daily wear casual top'],
  ['Denim Jacket Women', 'women', 1899, 8, 'Cropped denim jacket'],
  ['Leggings Pack of 2', 'women', 599, 24, 'Stretchable cotton leggings'],
  ['Stylish Handbag', 'women', 1599, 6, 'Faux leather shoulder bag'],
  ['Block Heels', 'women', 1299, 0, 'Comfortable block heel sandals'],
  ['White Sneakers', 'women', 1799, 13, 'Everyday casual sneakers'],
  ['Embroidered Dupatta', 'women', 499, 20, 'Soft georgette dupatta'],
  ['Crop Hoodie', 'women', 1199, 12, 'Cozy cropped fleece hoodie'],
  ['Anarkali Suit', 'women', 2499, 0, 'Party wear anarkali suit set'],
];

const docs = data.map(([name, category, price, stock, description]) => ({
  name,
  category,
  price,
  stock,
  description,
  image: img(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')),
}));

async function seedProducts({ reset = false } = {}) {
  if (reset) await Product.deleteMany({});
  else if ((await Product.countDocuments()) > 0) return false;
  await Product.insertMany(docs);
  const inStock = docs.filter((d) => d.stock > 0).length;
  console.log(`Seeded ${docs.length} products (${inStock} in stock, ${docs.length - inStock} out of stock)`);
  return true;
}

// Purane database me jo products picsum (online) photos use kar rahe the, unhe local images se badal deta hai.
// Admin ne jo image khud badli ho, wo touch nahi hoti.
async function syncImages() {
  let n = 0;
  for (const d of docs) {
    const r = await Product.updateOne(
      { name: d.name, image: { $regex: '^https://picsum\\.photos' } },
      { $set: { image: d.image } }
    );
    n += r.modifiedCount;
  }
  if (n) console.log(`${n} product images update hui`);
}

module.exports = { seedProducts, syncImages };
