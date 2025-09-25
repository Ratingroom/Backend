import { Router } from 'express';
import {
    getAllPeliculas,
    getPeliculaById,
    createPelicula,
    updatePelicula,
    deletePelicula,
    getPeliculaReviews
} from '../controller/peliculas.controller.js';

const router = Router();

// Rutas CRUD básicas
router.get('/', getAllPeliculas);
router.get('/:id', getPeliculaById);
router.post('/', createPelicula);
router.put('/:id', updatePelicula);
router.delete('/:id', deletePelicula);

// Rutas adicionales
router.get('/:id/reviews', getPeliculaReviews);

export default router;