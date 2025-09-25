import { Router } from 'express';
import {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewComentarios
} from '../controller/reviews.controller.js';

const router = Router();

// Obtener todas las reviews
// GET /reviews?page=1&limit=10&usuario_id=1&pelicula_id=1&rating=5
router.get('/', getAllReviews);

// Obtener una review por ID
// GET /reviews/:id
router.get('/:id', getReviewById);

// Crear una nueva review
// POST /reviews
router.post('/', createReview);

// Actualizar una review
// PUT /reviews/:id
router.put('/:id', updateReview);

// Eliminar una review
// DELETE /reviews/:id
router.delete('/:id', deleteReview);

// Obtener comentarios de una review
// GET /reviews/:id/comentarios?page=1&limit=10
router.get('/:id/comentarios', getReviewComentarios);

export default router;