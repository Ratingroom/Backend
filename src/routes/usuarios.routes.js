import { Router } from 'express';
import {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioReviews,
    getUsuarioSeguidores,
    getUsuarioSiguiendo
} from '../controller/usuarios.controller.js';

const router = Router();

// Rutas CRUD básicas
router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

// Rutas adicionales
router.get('/:id/reviews', getUsuarioReviews);
router.get('/:id/seguidores', getUsuarioSeguidores);
router.get('/:id/siguiendo', getUsuarioSiguiendo);

export default router;