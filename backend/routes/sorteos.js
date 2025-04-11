const express = require('express');
const pool = require('../config/db');// 📌 Asegúrate de importar tu conexión a PostgreSQL
const router = express.Router();

// 📌 Obtener todos los sorteos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM sorteos ORDER BY fecha_sorteo ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener sorteos:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// 📌 Obtener boletos por sorteo
router.get('/boletos/:sorteoId', async (req, res) => {
    try {
        const sorteoId = req.params.sorteoId;
        const result = await pool.query("SELECT * FROM boletos WHERE sorteo_id = $1", [sorteoId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No hay boletos para este sorteo" });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener boletos:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// 📌 Obtener el progreso de cada sorteo (boletos vendidos vs total)
router.get('/progreso', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.id AS sorteo_id,
                s.total_boletos AS total,
                COUNT(b.id) AS vendidos
            FROM sorteos s
            LEFT JOIN boletos b ON s.id = b.sorteo_id AND b.vendido = true
            GROUP BY s.id, s.total_boletos
            ORDER BY s.id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener progreso de los sorteos:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});


module.exports = router;
