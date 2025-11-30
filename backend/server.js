require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const journalRoutes = require('./routes/journalRoutes'); // ⬅️ NEU

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Healthcheck / Root =====
app.get('/', (req, res) => {
  res.json({ message: 'ToDo & Journal API is running' });
});

// ===== API-Routen =====
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/journal', journalRoutes); // ⬅️ NEUE ROUTE

// ===== MongoDB-Verbindung =====
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Fehlende Umgebungsvariable MONGODB_URI');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
