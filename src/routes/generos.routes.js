import { Router } from 'express';
import {
    getAllGeneros,
    getGeneroById,
    createGenero,
    updateGenero,
    deleteGenero,
    getGeneroPeliculas
} from '../controller/generos.controller.js';

const router = Router();

// Obtener todos los géneros
// GET /generos?page=1&limit=20&search=accion
router.get('/', getAllGeneros);

// Obtener un género por ID
// GET /generos/:id
router.get('/:id', getGeneroById);

// Crear un nuevo género
// POST /generos
router.post('/', createGenero);

// Actualizar un género
// PUT /generos/:id
router.put('/:id', updateGenero);

// Eliminar un género
// DELETE /generos/:id
router.delete('/:id', deleteGenero);

// Obtener películas de un género
// GET /generos/:id/peliculas?page=1&limit=10
router.get('/:id/peliculas', getGeneroPeliculas);

export default router;