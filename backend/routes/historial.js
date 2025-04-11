const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        b.numero AS numero_boleto,
        c.fecha,
        s.nombre AS sorteo
      FROM compra_boletos cb
      JOIN boletos b ON cb.boleto_id = b.id
      JOIN compras c ON cb.compra_id = c.id
      JOIN sorteos s ON b.sorteo_id = s.id
      WHERE c.usuario_id = $1
      ORDER BY c.fecha DESC
    `, [usuarioId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

module.exports = router;
