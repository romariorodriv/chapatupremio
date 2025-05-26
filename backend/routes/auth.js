const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// 🔐 Conexión directa con SSL
const pool = new Pool({
  user: 'meteleconfAdmin',
  host: 'auth-db-prod.cn2oo0ku0qtg.us-east-2.rds.amazonaws.com',
  database: 'auth_db',
  password: '1!Meteleconfe!',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// 🛂 Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("🧪 Intentando login para:", email);

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Correo no registrado' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    return res.status(200).json({
      message: "Login exitoso",
      redirectUrl: "../Dashboard/dashboard.html",
      username: user.username,
      usuario_id: user.id,
      role: user.role
    });

  } catch (error) {
    console.error("❌ Error ejecutando login:", error);
    return res.status(500).json({ message: "Error en el login", error });
  }
});

module.exports = router;
