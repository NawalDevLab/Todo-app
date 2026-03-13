const { pool } = require('../db/database');

// GET /api/todos
exports.getAllTodos = async (req, res) => {
  try {
    const { filter, priority } = req.query;
    let query = 'SELECT * FROM todos WHERE 1=1';
    const params = [];

    if (filter === 'active')    { query += ' AND completed = FALSE'; }
    if (filter === 'completed') { query += ' AND completed = TRUE'; }
    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY position ASC, created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/todos
exports.createTodo = async (req, res) => {
  try {
    const { title, description = '', priority = 'medium' } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const [result] = await pool.query(
      'INSERT INTO todos (title, description, priority) VALUES (?, ?, ?)',
      [title.trim(), description.trim(), priority]
    );
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    const fields = [];
    const params = [];

    if (title !== undefined)       { fields.push('title = ?');       params.push(title); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (completed !== undefined)   { fields.push('completed = ?');   params.push(completed); }
    if (priority !== undefined)    { fields.push('priority = ?');    params.push(priority); }

    if (!fields.length) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }

    params.push(id);
    await pool.query(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`, params);
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/todos/reorder
exports.reorderTodos = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, position }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items must be an array' });
    }
    await Promise.all(
      items.map(({ id, position }) =>
        pool.query('UPDATE todos SET position = ? WHERE id = ?', [position, id])
      )
    );
    res.json({ success: true, message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
