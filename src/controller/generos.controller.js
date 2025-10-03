import { Genero } from '../models/Genero.js';
import { Pelicula } from '../models/Pelicula.js';
import { Op } from 'sequelize';

// Obtener todos los géneros
export const getAllGeneros = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        
        // Filtro de búsqueda
        if (search) {
            whereClause.nombre = {
                [Op.iLike]: `%${search}%`
            };
        }

        const generos = await Genero.findAndCountAll({
            where: whereClause,
            include: [{
                model: Pelicula,
                as: 'peliculas',
                attributes: ['id'],
                through: { attributes: [] }
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['nombre', 'ASC']]
        });

        // Agregar conteo de películas por género
        const generosConConteo = generos.rows.map(genero => {
            const generoData = genero.toJSON();
            generoData.totalPeliculas = generoData.peliculas ? generoData.peliculas.length : 0;
            delete generoData.peliculas;
            return generoData;
        });

        res.json({
            success: true,
            data: {
                generos: generosConConteo,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(generos.count / limit),
                    totalItems: generos.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Géneros obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un género por ID
export const getGeneroById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const genero = await Genero.findByPk(id, {
            include: [{
                model: Pelicula,
                as: 'peliculas',
                attributes: ['id', 'titulo', 'portada', 'fechaSalida'],
                through: { attributes: [] },
                order: [['titulo', 'ASC']]
            }]
        });

        if (!genero) {
            return res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
        }

        res.json({
            success: true,
            data: genero,
            message: 'Género obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener género:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo género
export const createGenero = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Validaciones básicas
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del género es requerido'
            });
        }

        // Verificar si el género ya existe
        const existingGenero = await Genero.findOne({
            where: { 
                nombre: {
                    [Op.iLike]: nombre.trim()
                }
            }
        });

        if (existingGenero) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un género con ese nombre'
            });
        }

        const nuevoGenero = await Genero.create({
            nombre: nombre.trim(),
            descripcion: descripcion ? descripcion.trim() : null
        });

        res.status(201).json({
            success: true,
            data: nuevoGenero,
            message: 'Género creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear género:', error);
        
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

// Actualizar un género
export const updateGenero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const genero = await Genero.findByPk(id);
        if (!genero) {
            return res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
        }

        // Verificar si el nuevo nombre ya existe (excluyendo el género actual)
        if (nombre && nombre.trim() !== genero.nombre) {
            const existingGenero = await Genero.findOne({
                where: { 
                    nombre: {
                        [Op.iLike]: nombre.trim()
                    },
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (existingGenero) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un género con ese nombre'
                });
            }
        }

        // Actualizar campos
        const updateData = {};
        if (nombre) updateData.nombre = nombre.trim();
        if (descripcion !== undefined) updateData.descripcion = descripcion ? descripcion.trim() : null;

        await genero.update(updateData);

        res.json({
            success: true,
            data: genero,
            message: 'Género actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar género:', error);
        
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

// Eliminar un género
export const deleteGenero = async (req, res) => {
    try {
        const { id } = req.params;

        const genero = await Genero.findByPk(id, {
            include: [{
                model: Pelicula,
                as: 'peliculas',
                attributes: ['id'],
                through: { attributes: [] }
            }]
        });

        if (!genero) {
            return res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
        }

        // Verificar si el género tiene películas asociadas
        if (genero.peliculas && genero.peliculas.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'No se puede eliminar el género porque tiene películas asociadas',
                data: {
                    totalPeliculas: genero.peliculas.length
                }
            });
        }

        await genero.destroy();

        res.json({
            success: true,
            message: 'Género eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar género:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener películas de un género
export const getGeneroPeliculas = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const genero = await Genero.findByPk(id);
        if (!genero) {
            return res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
        }

        const peliculas = await Pelicula.findAndCountAll({
            include: [{
                model: Genero,
                as: 'generos',
                where: { id: id },
                attributes: [],
                through: { attributes: [] }
            }],
            attributes: ['id', 'titulo', 'portada', 'fechaSalida', 'descripcion'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['titulo', 'ASC']]
        });

        res.json({
            success: true,
            data: {
                genero: {
                    id: genero.id,
                    nombre: genero.nombre,
                    descripcion: genero.descripcion
                },
                peliculas: peliculas.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(peliculas.count / limit),
                    totalItems: peliculas.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Películas del género obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener películas del género:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};