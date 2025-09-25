import express from 'express';
import routes from './routes/routes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configurar las rutas de la API
app.use('/api', routes);

export default app;
