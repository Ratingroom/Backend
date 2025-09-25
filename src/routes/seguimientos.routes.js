import { Router } from 'express';
import {
    seguirUsuario,
    dejarDeSeguirUsuario,
    getSeguidores,
    getSiguiendo,
    verificarSeguimiento,
    getEstadisticasSeguimiento
} from '../controller/seguimientos.controller.js';

const router = Router();

// Seguir a un usuario
// POST /seguimientos
router.post('/', seguirUsuario);

// Dejar de seguir a un usuario
// DELETE /seguimientos/:seguidor_id/:seguido_id
router.delete('/:seguidor_id/:seguido_id', dejarDeSeguirUsuario);

// Obtener seguidores de un usuario
// GET /seguimientos/:usuario_id/seguidores?page=1&limit=10
router.get('/:usuario_id/seguidores', getSeguidores);

// Obtener usuarios que sigue un usuario
// GET /seguimientos/:usuario_id/siguiendo?page=1&limit=10
router.get('/:usuario_id/siguiendo', getSiguiendo);

// Verificar si un usuario sigue a otro
// GET /seguimientos/:seguidor_id/:seguido_id/verificar
router.get('/:seguidor_id/:seguido_id/verificar', verificarSeguimiento);

// Obtener estadísticas de seguimiento de un usuario
// GET /seguimientos/:usuario_id/estadisticas
router.get('/:usuario_id/estadisticas', getEstadisticasSeguimiento);

export default router;