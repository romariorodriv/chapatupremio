// Importa el módulo express para crear rutas
const express = require('express');

// Importa el módulo bcryptjs para encriptar contraseñas
const bcrypt = require('bcryptjs');

// Importa la instancia de Pool para interactuar con la base de datos
const pool = require('../config/db');

// Crea un nuevo enrutador de Express
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body; // Obtiene los datos del cuerpo de la solicitud
    try {
        // Encripta la contraseña del usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        // Inserta el nuevo usuario en la base de datos
        await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
        // Responde con un mensaje de éxito y una URL de redirección
        res.status(201).json({ message: 'Registro exitoso', redirectUrl: '../Dashboard/dashboard.html', username });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ message: 'Error en el registro', error });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Obtiene los datos del cuerpo de la solicitud

    try {
        // Busca al usuario en la base de datos por su email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            // Si no se encuentra el usuario, responde con un mensaje de error
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0]; // Obtiene el usuario encontrado
        
        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Si las contraseñas no coinciden, responde con un mensaje de error
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Si las contraseñas coinciden, responde con un mensaje de éxito y una URL de redirección
        res.status(200).json({
            message: 'Login exitoso', 
            redirectUrl: '../Dashboard/dashboard.html', 
            username: user.username,
            usuario_id: user.id // 👈 esto es lo que te faltaba
         });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ message: 'Error en el login', error });
    }
});

// Exporta el enrutador para que pueda ser utilizado en otros módulos
module.exports = router;