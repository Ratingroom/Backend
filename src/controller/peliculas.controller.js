import { Op } from 'sequelize';
import { Pelicula } from '../models/Pelicula.js';
import { Genero } from '../models/Genero.js';
import { Reviews } from '../models/Reviews.js';
import { Usuario } from '../models/Usuario.js';

// Obtener todas las películas
export const getAllPeliculas = async (req, res) => {
    try {
        const { page = 1, limit = 10, genero, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        
        // Filtro por búsqueda
        if (search) {
            whereClause.titulo = {
                [Op.iLike]: `%${search}%`
            };
        }

        const peliculas = await Pelicula.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Genero,
                    as: 'generos',
                    attributes: ['id', 'nombre'],
                    ...(genero && {
                        where: { nombre: genero }
                    })
                },
                {
                    model: Reviews,
                    as: 'reviews',
                    attributes: ['rating'],
                    separate: true
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        // Calcular rating promedio para cada película
        const peliculasConRating = peliculas.rows.map(pelicula => {
            const peliculaData = pelicula.toJSON();
            if (peliculaData.reviews && peliculaData.reviews.length > 0) {
                const totalRating = peliculaData.reviews.reduce((sum, review) => sum + review.rating, 0);
                peliculaData.averageRating = (totalRating / peliculaData.reviews.length).toFixed(1);
                peliculaData.totalReviews = peliculaData.reviews.length;
            } else {
                peliculaData.averageRating = 0;
                peliculaData.totalReviews = 0;
            }
            delete peliculaData.reviews; // No necesitamos enviar todas las reviews
            return peliculaData;
        });

        res.json({
            success: true,
            data: {
                peliculas: peliculasConRating,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(peliculas.count / limit),
                    totalItems: peliculas.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Películas obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener películas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una película por ID
export const getPeliculaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const pelicula = await Pelicula.findByPk(id, {
            include: [
                {
                    model: Genero,
                    as: 'generos',
                    attributes: ['id', 'nombre', 'descripcion']
                },
                {
                    model: Reviews,
                    as: 'reviews',
                    attributes: ['id', 'rating', 'texto', 'createdAt'],
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['id', 'username', 'foto_perfil']
                    }],
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!pelicula) {
            return res.status(404).json({
                success: false,
                message: 'Película no encontrada'
            });
        }

        // Calcular estadísticas de reviews
        const peliculaData = pelicula.toJSON();
        if (peliculaData.reviews && peliculaData.reviews.length > 0) {
            const totalRating = peliculaData.reviews.reduce((sum, review) => sum + review.rating, 0);
            peliculaData.averageRating = (totalRating / peliculaData.reviews.length).toFixed(1);
            peliculaData.totalReviews = peliculaData.reviews.length;
            
            // Distribución de ratings
            peliculaData.ratingDistribution = {
                5: peliculaData.reviews.filter(r => r.rating === 5).length,
                4: peliculaData.reviews.filter(r => r.rating === 4).length,
                3: peliculaData.reviews.filter(r => r.rating === 3).length,
                2: peliculaData.reviews.filter(r => r.rating === 2).length,
                1: peliculaData.reviews.filter(r => r.rating === 1).length
            };
        } else {
            peliculaData.averageRating = 0;
            peliculaData.totalReviews = 0;
            peliculaData.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        }

        res.json({
            success: true,
            data: peliculaData,
            message: 'Película obtenida exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener película:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva película
export const createPelicula = async (req, res) => {
    try {
        const { titulo, descripcion, fecha_lanzamiento, subcategoria, imagen, generos } = req.body;

        // Validaciones básicas
        if (!titulo || !descripcion || !fecha_lanzamiento) {
            return res.status(400).json({
                success: false,
                message: 'Título, descripción y fecha de lanzamiento son requeridos'
            });
        }

        // Verificar si la película ya existe
        const existingPelicula = await Pelicula.findOne({ where: { titulo } });
        if (existingPelicula) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una película con ese título'
            });
        }

        const nuevaPelicula = await Pelicula.create({
            titulo,
            descripcion,
            fecha_lanzamiento,
            subcategoria: subcategoria || 'General',
            imagen: imagen || 'https://via.placeholder.com/300x450'
        });

        // Asociar géneros si se proporcionan
        if (generos && Array.isArray(generos) && generos.length > 0) {
            const generosExistentes = await Genero.findAll({
                where: { id: generos }
            });
            await nuevaPelicula.setGeneros(generosExistentes);
        }

        // Obtener la película con sus géneros
        const peliculaCompleta = await Pelicula.findByPk(nuevaPelicula.id, {
            include: [{
                model: Genero,
                as: 'generos',
                attributes: ['id', 'nombre']
            }]
        });

        res.status(201).json({
            success: true,
            data: peliculaCompleta,
            message: 'Película creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear película:', error);
        
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

// Actualizar una película
export const updatePelicula = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, fecha_lanzamiento, subcategoria, imagen, generos } = req.body;

        const pelicula = await Pelicula.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({
                success: false,
                message: 'Película no encontrada'
            });
        }

        // Verificar si el nuevo título ya existe (si se está cambiando)
        if (titulo && titulo !== pelicula.titulo) {
            const existingPelicula = await Pelicula.findOne({ where: { titulo } });
            if (existingPelicula) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una película con ese título'
                });
            }
        }

        // Actualizar campos
        const updateData = {};
        if (titulo) updateData.titulo = titulo;
        if (descripcion) updateData.descripcion = descripcion;
        if (fecha_lanzamiento) updateData.fecha_lanzamiento = fecha_lanzamiento;
        if (subcategoria) updateData.subcategoria = subcategoria;
        if (imagen) updateData.imagen = imagen;

        await pelicula.update(updateData);

        // Actualizar géneros si se proporcionan
        if (generos && Array.isArray(generos)) {
            const generosExistentes = await Genero.findAll({
                where: { id: generos }
            });
            await pelicula.setGeneros(generosExistentes);
        }

        // Obtener la película actualizada con sus géneros
        const peliculaActualizada = await Pelicula.findByPk(id, {
            include: [{
                model: Genero,
                as: 'generos',
                attributes: ['id', 'nombre']
            }]
        });

        res.json({
            success: true,
            data: peliculaActualizada,
            message: 'Película actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar película:', error);
        
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

// Eliminar una película
export const deletePelicula = async (req, res) => {
    try {
        const { id } = req.params;

        const pelicula = await Pelicula.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({
                success: false,
                message: 'Película no encontrada'
            });
        }

        await pelicula.destroy();

        res.json({
            success: true,
            message: 'Película eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar película:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener reviews de una película
export const getPeliculaReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const pelicula = await Pelicula.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({
                success: false,
                message: 'Película no encontrada'
            });
        }

        const reviews = await Reviews.findAndCountAll({
            where: { pelicula_id: id },
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'username', 'foto_perfil']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                reviews: reviews.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(reviews.count / limit),
                    totalItems: reviews.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Reviews de la película obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener reviews de la película:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};