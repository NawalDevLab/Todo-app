const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { initDB }  = require('./db/database');
const todoRoutes  = require('./routes/todos');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ──────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Todo App API is running',
    version: '1.0.0',
    endpoints: {
      'GET    /api/todos':          'Get all todos (filters: ?filter=active|completed&priority=low|medium|high)',
      'POST   /api/todos':          'Create todo { title, description?, priority? }',
      'PUT    /api/todos/:id':      'Update todo',
      'DELETE /api/todos/:id':      'Delete todo',
      'PATCH  /api/todos/reorder':  'Reorder todos { items: [{id, position}] }',
    }
  });
});

// ── 404 ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
