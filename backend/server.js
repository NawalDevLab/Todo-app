const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./db/database');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
    res.json({ message: '🚀 Todo App API is running' });
});

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});