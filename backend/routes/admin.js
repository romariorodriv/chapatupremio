const express = require('express');
const pool = require('../config/db');
const { authenticateToken, isAdmin } = require('./authMiddleware');
const router = express.Router();

// Listar usuarios
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
    const users = await pool.query('SELECT id, username, email, role FROM users');
    res.json(users.rows);
});

// Eliminar usuario
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'Usuario eliminado' });
});

// Editar usuario
router.put('/users/:id', authenticateToken, isAdmin, async (req, res) => {
    const { username, email, role } = req.body;
    await pool.query(
        'UPDATE users SET username=$1, email=$2, role=$3 WHERE id=$4',
        [username, email, role, req.params.id]
    );
    res.json({ message: 'Usuario actualizado' });
});

// Listar tickets vendidos
router.get('/tickets', authenticateToken, isAdmin, async (req, res) => {
    const tickets = await pool.query('SELECT * FROM tickets');
    res.json(tickets.rows);
});

module.exports = router;