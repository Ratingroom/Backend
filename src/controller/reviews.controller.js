import { Reviews } from '../models/Reviews.js';
import { Usuario } from '../models/Usuario.js';
import { Pelicula } from '../models/Pelicula.js';
import { Comentarios } from '../models/Comentarios.js';

// Obtener todas las reviews
export const getAllReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, usuario_id, pelicula_id, rating } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        
        // Filtros
        if (usuario_id) whereClause.usuario_id = usuario_id;
        if (pelicula_id) whereClause.pelicula_id = pelicula_id;
        if (rating) whereClause.rating = rating;

        const reviews = await Reviews.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'username', 'fotoPerfil']
                },
                {
                    model: Pelicula,
                    as: 'pelicula',
                    attributes: ['id', 'titulo', 'portada']
                },
                {
                    model: Comentarios,
                    as: 'comentarios',
                    attributes: ['id'],
                    separate: true
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        // Agregar conteo de comentarios
        const reviewsConComentarios = reviews.rows.map(review => {
            const reviewData = review.toJSON();
            reviewData.totalComentarios = reviewData.comentarios ? reviewData.comentarios.length : 0;
            delete reviewData.comentarios;
            return reviewData;
        });

        res.json({
            success: true,
            data: {
                reviews: reviewsConComentarios,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(reviews.count / limit),
                    totalItems: reviews.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Reviews obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una review por ID
export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const review = await Reviews.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'username', 'fotoPerfil']
                },
                {
                    model: Pelicula,
                    as: 'pelicula',
                    attributes: ['id', 'titulo', 'portada', 'descripcion']
                },
                {
                    model: Comentarios,
                    as: 'comentarios',
                    attributes: ['id', 'texto', 'createdAt'],
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['id', 'username', 'fotoPerfil']
                    }],
                    order: [['createdAt', 'ASC']]
                }
            ]
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review no encontrada'
            });
        }

        res.json({
            success: true,
            data: review,
            message: 'Review obtenida exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener review:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva review
export const createReview = async (req, res) => {
    try {
        const { rating, texto, usuario_id, pelicula_id } = req.body;

        // Validaciones básicas
        if (!rating || !usuario_id || !pelicula_id) {
            return res.status(400).json({
                success: false,
                message: 'Rating, usuario_id y pelicula_id son requeridos'
            });
        }

        // Validar que el rating esté entre 1 y 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'El rating debe estar entre 1 y 5'
            });
        }

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que la película existe
        const pelicula = await Pelicula.findByPk(pelicula_id);
        if (!pelicula) {
            return res.status(404).json({
                success: false,
                message: 'Película no encontrada'
            });
        }

        // Verificar si el usuario ya tiene una review para esta película
        const existingReview = await Reviews.findOne({
            where: { usuario_id, pelicula_id }
        });
        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: 'Ya tienes una review para esta película'
            });
        }

        const nuevaReview = await Reviews.create({
            rating,
            texto: texto || '',
            usuario_id,
            pelicula_id
        });

        // Obtener la review completa con relaciones
        const reviewCompleta = await Reviews.findByPk(nuevaReview.id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'username', 'fotoPerfil']
                },
                {
                    model: Pelicula,
                    as: 'pelicula',
                    attributes: ['id', 'titulo', 'portada']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: reviewCompleta,
            message: 'Review creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear review:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar una review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, texto } = req.body;

        const review = await Reviews.findByPk(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review no encontrada'
            });
        }

        // Validar rating si se proporciona
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'El rating debe estar entre 1 y 5'
            });
        }

        // Actualizar campos
        const updateData = {};
        if (rating) updateData.rating = rating;
        if (texto !== undefined) updateData.texto = texto;

        await review.update(updateData);

        // Obtener la review actualizada con relaciones
        const reviewActualizada = await Reviews.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'username', 'fotoPerfil']
                },
                {
                    model: Pelicula,
                    as: 'pelicula',
                    attributes: ['id', 'titulo', 'portada']
                }
            ]
        });

        res.json({
            success: true,
            data: reviewActualizada,
            message: 'Review actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar review:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar una review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Reviews.findByPk(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review no encontrada'
            });
        }

        await review.destroy();

        res.json({
            success: true,
            message: 'Review eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar review:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener comentarios de una review
export const getReviewComentarios = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const review = await Reviews.findByPk(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review no encontrada'
            });
        }

        const comentarios = await Comentarios.findAndCountAll({
            where: { review_id: id },
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'username', 'fotoPerfil']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'ASC']]
        });

        res.json({
            success: true,
            data: {
                comentarios: comentarios.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(comentarios.count / limit),
                    totalItems: comentarios.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Comentarios de la review obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener comentarios de la review:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};