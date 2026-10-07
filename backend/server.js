require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { seedProducts, syncImages } = require('./seedData');

const app = express();

const origins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
  : '*';

app.use(cors({ origin: origins }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, name: 'Shopping Centre API' }));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

// Built frontend (frontend/dist) isi server se serve hota hai => sirf ek hi server chalana padta hai
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  app.get('/', (req, res) =>
    res.send('API chal raha hai, lekin frontend build nahi mila. frontend folder me "npm run build" chalao.')
  );
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'shopping-centre-local-secret-change-me';
}

connectDB()
  .then(() => seedProducts()) // products tabhi daalta hai jab database khali ho
  .then(() => syncImages())
  .then(() => {
    app.listen(PORT, () => {
      console.log('');
      console.log('=========================================');
      console.log(' Shopping Centre chal gaya!');
      console.log(` Shop :  http://localhost:${PORT}`);
      console.log(` Admin:  http://localhost:${PORT}/admin/login`);
      console.log(' (band karne ke liye is window me Ctrl+C dabao)');
      console.log('=========================================');
    });
  })
  .catch((err) => {
    console.error('Start nahi ho paya:', err.message);
    process.exit(1);
  });
