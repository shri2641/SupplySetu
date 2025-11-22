import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_change_me';

const defaultOrigins =
  process.env.NODE_ENV === 'production'
    ? ['http://localhost:3000']
    : ['*'];

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

mongoose.set('strictQuery', true);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supplysetu';

mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    stockKg: { type: Number, default: 0 },
    moqKg: { type: Number, default: 0 },
    leadTimeDays: { type: Number, default: 1 },
    image: { type: String, trim: true },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: String,
  },
  { _id: false }
);

const inventoryItemSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    qty: { type: String, required: true },
    status: { type: String, default: 'In Stock' },
  },
  { _id: false }
);

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    pincode: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 4.0 },
    phone: { type: String, trim: true },
    specialties: [{ type: String }],
    products: { type: [productSchema], default: [] },
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true }
);

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    groupBuy: { type: Boolean, default: false },
    inventory: { type: [inventoryItemSchema], default: [] },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['vendor', 'supplier'], required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const sessionSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' },
});

const Supplier = mongoose.model('Supplier', supplierSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const requireSupplierRole = (req, res, next) => {
  if (req.user?.role !== 'supplier') {
    return res.status(403).json({ error: 'Supplier access only' });
  }
  next();
};

const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ error: 'Session expired' });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/suppliers', asyncHandler(async (req, res) => {
  const { location, pincode } = req.query;
  const filters = {};
  if (location) {
    filters.location = { $regex: location, $options: 'i' };
  }
  if (pincode) {
    filters.pincode = { $regex: `^${pincode}` };
  }
  const suppliers = await Supplier.find(filters).sort({ createdAt: -1 });
  res.json(suppliers);
}));

app.get('/api/suppliers/:id', asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  res.json(supplier);
}));

app.post('/api/suppliers', asyncHandler(async (req, res) => {
  const { name, location, rating, pincode, phone, specialties, products, reviews } = req.body;
  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location are required' });
  }
  const supplier = await Supplier.create({
    name,
    location,
    rating,
    pincode,
    phone,
    specialties,
    products,
    reviews,
  });
  res.status(201).json(supplier);
}));

app.delete('/api/suppliers/:id', asyncHandler(async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.status(204).end();
}));

app.post('/api/suppliers/:id/products', auth, requireSupplierRole, asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  const { name, category, price, unit = 'kg', stockKg = 0, moqKg = 0, leadTimeDays = 1, image } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category and price are required' });
  }
  supplier.products.push({ name, category, price, unit, stockKg, moqKg, leadTimeDays, image });
  await supplier.save();
  res.json(supplier);
}));

app.patch('/api/suppliers/:id/products/:name', auth, requireSupplierRole, asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  const name = decodeURIComponent(req.params.name);
  const product = supplier.products.find(p => p.name === name);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const fields = ['price', 'unit', 'stockKg', 'moqKg', 'leadTimeDays', 'image', 'category', 'name'];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });
  await supplier.save();
  res.json(product);
}));

app.delete('/api/suppliers/:id/products/:name', auth, requireSupplierRole, asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  const name = decodeURIComponent(req.params.name);
  supplier.products = supplier.products.filter(p => p.name !== name);
  await supplier.save();
  res.json(supplier);
}));

app.get('/api/vendors', asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().sort({ createdAt: -1 });
  res.json(vendors);
}));

app.post('/api/vendors', asyncHandler(async (req, res) => {
  const { name, location, phone, groupBuy, inventory } = req.body;
  if (!name || !location || !phone) {
    return res.status(400).json({ error: 'Name, location and phone are required' });
  }
  const vendor = await Vendor.create({ name, location, phone, groupBuy, inventory });
  res.status(201).json(vendor);
}));

app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, location } = req.body;
  if (!name || !email || !password || !role || !phone || !location) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ name, email, password: hashed, role, phone, location });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(400).json({ error: 'Registration failed' });
    }
  }
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
  await Session.create({ token, userId: user._id });
  res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
}));

app.post('/api/auth/logout', auth, asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  await Session.deleteOne({ token });
  res.json({ message: 'Logged out' });
}));

app.post('/api/demo-seed', asyncHandler(async (req, res) => {
  const demoSuppliers = [
    {
      name: 'FreshMart',
      location: 'Delhi',
      pincode: '110001',
      rating: 4.8,
      phone: '9876543210',
      specialties: ['Vegetables', 'Fruits'],
      products: [
        { name: 'Tomatoes', category: 'Vegetables', price: 30, unit: 'kg', stockKg: 500, moqKg: 20, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=80&q=80' },
        { name: 'Onions', category: 'Vegetables', price: 25, unit: 'kg', stockKg: 800, moqKg: 20, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80' },
      ],
      reviews: [
        { name: 'Ravi', rating: 5, comment: 'Great quality and timely delivery!' },
        { name: 'Sita', rating: 4, comment: 'Affordable prices, will buy again.' },
      ],
    },
    {
      name: 'VeggieHub',
      location: 'Mumbai',
      pincode: '400001',
      rating: 4.6,
      phone: '9123456789',
      specialties: ['Vegetables'],
      products: [
        { name: 'Carrots', category: 'Vegetables', price: 40, unit: 'kg', stockKg: 450, moqKg: 20, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80' },
        { name: 'Green Peas', category: 'Vegetables', price: 55, unit: 'kg', stockKg: 200, moqKg: 15, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1515541965486-c2c3b5640e03?auto=format&fit=crop&w=80&q=80' },
      ],
      reviews: [
        { name: 'Priya', rating: 5, comment: 'Fresh veggies every time!' },
        { name: 'Sunil', rating: 4, comment: 'Good service.' },
      ],
    },
    {
      name: 'SpiceWorld',
      location: 'Kolkata',
      pincode: '700001',
      rating: 4.9,
      phone: '9988776655',
      specialties: ['Spices'],
      products: [
        { name: 'Turmeric Powder', category: 'Spices', price: 220, unit: 'kg', stockKg: 120, moqKg: 10, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1604908553938-72be8a1ddf40?auto=format&fit=crop&w=80&q=80' },
        { name: 'Red Chili Powder', category: 'Spices', price: 260, unit: 'kg', stockKg: 100, moqKg: 10, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1586201375754-1421e0aa2f99?auto=format&fit=crop&w=80&q=80' },
      ],
      reviews: [
        { name: 'Nisha', rating: 5, comment: 'Excellent aroma and quality!' },
        { name: 'Arun', rating: 4, comment: 'Timely delivery, decent pricing.' },
      ],
    },
    {
      name: 'DairyDirect',
      location: 'Chennai',
      pincode: '600001',
      rating: 4.7,
      phone: '9812345678',
      specialties: ['Dairy'],
      products: [
        { name: 'Milk (Bulk)', category: 'Dairy', price: 48, unit: 'litre', stockKg: 1000, moqKg: 50, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=80&q=80' },
        { name: 'Paneer', category: 'Dairy', price: 320, unit: 'kg', stockKg: 150, moqKg: 10, leadTimeDays: 1, image: 'https://images.unsplash.com/photo-1542444592-1d8c78c147c3?auto=format&fit=crop&w=80&q=80' },
      ],
    },
    {
      name: 'GrainBazaar',
      location: 'Bangalore',
      pincode: '560001',
      rating: 4.5,
      phone: '9090909090',
      specialties: ['Grains'],
      products: [
        { name: 'Basmati Rice', category: 'Grains', price: 75, unit: 'kg', stockKg: 300, moqKg: 50, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1604908176997-431c35a9f3ab?auto=format&fit=crop&w=80&q=80' },
        { name: 'Whole Wheat Flour', category: 'Grains', price: 48, unit: 'kg', stockKg: 500, moqKg: 50, leadTimeDays: 2, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=80&q=80' },
      ],
    },
  ];

  const demoVendors = [
    {
      name: 'Ravi Kumar',
      location: 'Delhi',
      phone: '9876543210',
      groupBuy: true,
      inventory: [
        { item: 'Tomatoes', qty: '120 kg', status: 'In Stock' },
        { item: 'Onions', qty: '80 kg', status: 'Low Stock' },
      ],
    },
    {
      name: 'Sita Devi',
      location: 'Mumbai',
      phone: '9123456789',
      groupBuy: false,
      inventory: [
        { item: 'Carrots', qty: '150 kg', status: 'In Stock' },
        { item: 'Potatoes', qty: '200 kg', status: 'In Transit' },
      ],
    },
    {
      name: 'Amit Singh',
      location: 'Kolkata',
      phone: '9988776655',
      groupBuy: true,
      inventory: [
        { item: 'Spices Pack', qty: '60 kg', status: 'In Stock' },
        { item: 'Rice', qty: '300 kg', status: 'In Stock' },
      ],
    },
  ];

  await Supplier.deleteMany({});
  await Vendor.deleteMany({});
  await Supplier.insertMany(demoSuppliers);
  await Vendor.insertMany(demoVendors);
  res.json({ message: 'Demo suppliers and vendors seeded' });
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});