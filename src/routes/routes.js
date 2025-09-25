import { Router } from 'express';
import usuariosRoutes from './usuarios.routes.js';
import peliculasRoutes from './peliculas.routes.js';
import reviewsRoutes from './reviews.routes.js';
import generosRoutes from './generos.routes.js';
import seguimientosRoutes from './seguimientos.routes.js';

const router = Router();

// Ruta de bienvenida para la API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenido a la API de DESMOVIL',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            peliculas: '/api/peliculas',
            reviews: '/api/reviews',
            generos: '/api/generos',
            seguimientos: '/api/seguimientos'
        },
        documentation: {
            usuarios: {
                'GET /usuarios': 'Obtener todos los usuarios',
                'GET /usuarios/:id': 'Obtener usuario por ID',
                'POST /usuarios': 'Crear nuevo usuario',
                'PUT /usuarios/:id': 'Actualizar usuario',
                'DELETE /usuarios/:id': 'Eliminar usuario',
                'GET /usuarios/:id/reviews': 'Obtener reviews del usuario',
                'GET /usuarios/:id/seguidores': 'Obtener seguidores del usuario',
                'GET /usuarios/:id/siguiendo': 'Obtener usuarios que sigue'
            },
            peliculas: {
                'GET /peliculas': 'Obtener todas las películas',
                'GET /peliculas/:id': 'Obtener película por ID',
                'POST /peliculas': 'Crear nueva película',
                'PUT /peliculas/:id': 'Actualizar película',
                'DELETE /peliculas/:id': 'Eliminar película',
                'GET /peliculas/:id/reviews': 'Obtener reviews de la película'
            },
            reviews: {
                'GET /reviews': 'Obtener todas las reviews',
                'GET /reviews/:id': 'Obtener review por ID',
                'POST /reviews': 'Crear nueva review',
                'PUT /reviews/:id': 'Actualizar review',
                'DELETE /reviews/:id': 'Eliminar review',
                'GET /reviews/:id/comentarios': 'Obtener comentarios de la review'
            },
            generos: {
                'GET /generos': 'Obtener todos los géneros',
                'GET /generos/:id': 'Obtener género por ID',
                'POST /generos': 'Crear nuevo género',
                'PUT /generos/:id': 'Actualizar género',
                'DELETE /generos/:id': 'Eliminar género',
                'GET /generos/:id/peliculas': 'Obtener películas del género'
            },
            seguimientos: {
                'POST /seguimientos': 'Seguir a un usuario',
                'DELETE /seguimientos/:seguidor_id/:seguido_id': 'Dejar de seguir usuario',
                'GET /seguimientos/:usuario_id/seguidores': 'Obtener seguidores',
                'GET /seguimientos/:usuario_id/siguiendo': 'Obtener usuarios seguidos',
                'GET /seguimientos/:seguidor_id/:seguido_id/verificar': 'Verificar seguimiento',
                'GET /seguimientos/:usuario_id/estadisticas': 'Estadísticas de seguimiento'
            }
        }
    });
});

// Configurar las rutas de cada módulo
router.use('/usuarios', usuariosRoutes);
router.use('/peliculas', peliculasRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/generos', generosRoutes);
router.use('/seguimientos', seguimientosRoutes);

// Middleware para manejar rutas no encontradas
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        availableEndpoints: [
            '/api/',
            '/api/usuarios',
            '/api/peliculas',
            '/api/reviews',
            '/api/generos',
            '/api/seguimientos'
        ]
    });
});

export default router;