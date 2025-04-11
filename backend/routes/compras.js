const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Asegúrate de tener tu conexión

// Comprar boletos
router.post('/', async (req, res) => {
    const { usuario_id, sorteo_id, boletos } = req.body; // boletos = [101, 102, 103]
    
    if (!usuario_id || !sorteo_id || !boletos || boletos.length === 0) {
        return res.status(400).json({ message: 'Datos incompletos para la compra.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Crear la compra
        const compraResult = await client.query(
            `INSERT INTO compras (usuario_id, sorteo_id, cantidad_boletos) 
             VALUES ($1, $2, $3) RETURNING id`,
            [usuario_id, sorteo_id, boletos.length]
        );
        const compra_id = compraResult.rows[0].id;

        // 2. Marcar los boletos como vendidos y asociarlos a la compra
        for (const numero of boletos) {
            // Obtener ID del boleto por sorteo y número
            const boletoRes = await client.query(
                `SELECT id FROM boletos WHERE sorteo_id = $1 AND numero = $2 AND vendido = false LIMIT 1`,
                [sorteo_id, numero]
            );

            if (boletoRes.rowCount === 0) {
                throw new Error(`El boleto número ${numero} ya fue vendido o no existe.`);
            }

            const boleto_id = boletoRes.rows[0].id;

            // Actualizar boleto como vendido
            await client.query(
                `UPDATE boletos SET vendido = true, usuario_id = $1, estado = 'vendido' WHERE id = $2`,
                [usuario_id, boleto_id]
            );

            // Insertar en tabla intermedia
            await client.query(
                `INSERT INTO compra_boletos (compra_id, boleto_id) VALUES ($1, $2)`,
                [compra_id, boleto_id]
            );
        }

        // 3. Actualizar boletos_comprados en la tabla sorteos
        await client.query(`
            UPDATE sorteos 
            SET boletos_comprados = (
                SELECT COUNT(*) FROM boletos WHERE sorteo_id = $1 AND vendido = true
            )
            WHERE id = $1
        `, [sorteo_id]);

        await client.query('COMMIT');
        res.json({ message: 'Compra realizada con éxito.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en compra:', error);
        res.status(500).json({ message: 'Error al realizar la compra.', error: error.message });
    } finally {
        client.release();
    }
});



module.exports = router;
