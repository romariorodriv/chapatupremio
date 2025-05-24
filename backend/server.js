const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const sorteosRoutes = require('./routes/sorteos'); 
const comprasRoutes = require('./routes/compras');
const historialRoutes = require('./routes/historial');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/sorteos', sorteosRoutes); 
app.use('/api/compras', comprasRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/admin', require('./routes/admin'));

app.use(express.static(path.join(__dirname, '../FRONT')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONT/Home/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
