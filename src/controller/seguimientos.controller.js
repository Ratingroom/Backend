import { Seguimientos } from '../models/Seguimientos.js';
import { Usuario } from '../models/Usuario.js';
import { Op } from 'sequelize';

// Seguir a un usuario
export const seguirUsuario = async (req, res) => {
    try {
        const { seguidor_id, seguido_id } = req.body;

        // Validaciones básicas
        if (!seguidor_id || !seguido_id) {
            return res.status(400).json({
                success: false,
                message: 'seguidor_id y seguido_id son requeridos'
            });
        }

        // Verificar que no se esté intentando seguir a sí mismo
        if (seguidor_id === seguido_id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes seguirte a ti mismo'
            });
        }

        // Verificar que ambos usuarios existen
        const [seguidor, seguido] = await Promise.all([
            Usuario.findByPk(seguidor_id),
            Usuario.findByPk(seguido_id)
        ]);

        if (!seguidor) {
            return res.status(404).json({
                success: false,
                message: 'Usuario seguidor no encontrado'
            });
        }

        if (!seguido) {
            return res.status(404).json({
                success: false,
                message: 'Usuario a seguir no encontrado'
            });
        }

        // Verificar si ya existe la relación de seguimiento
        const existingSeguimiento = await Seguimientos.findOne({
            where: { seguidor_id, seguido_id }
        });

        if (existingSeguimiento) {
            return res.status(409).json({
                success: false,
                message: 'Ya sigues a este usuario'
            });
        }

        // Crear el seguimiento
        const nuevoSeguimiento = await Seguimientos.create({
            seguidor_id,
            seguido_id
        });

        // Obtener el seguimiento completo con información de usuarios
        const seguimientoCompleto = await Seguimientos.findByPk(nuevoSeguimiento.id, {
            include: [
                {
                    model: Usuario,
                    as: 'seguidor',
                    attributes: ['id', 'username', 'foto_perfil']
                },
                {
                    model: Usuario,
                    as: 'seguido',
                    attributes: ['id', 'username', 'foto_perfil']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: seguimientoCompleto,
            message: 'Ahora sigues a este usuario'
        });
    } catch (error) {
        console.error('Error al seguir usuario:', error);
        
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

// Dejar de seguir a un usuario
export const dejarDeSeguirUsuario = async (req, res) => {
    try {
        const { seguidor_id, seguido_id } = req.params;

        // Validaciones básicas
        if (!seguidor_id || !seguido_id) {
            return res.status(400).json({
                success: false,
                message: 'seguidor_id y seguido_id son requeridos'
            });
        }

        // Buscar el seguimiento
        const seguimiento = await Seguimientos.findOne({
            where: { seguidor_id, seguido_id }
        });

        if (!seguimiento) {
            return res.status(404).json({
                success: false,
                message: 'No sigues a este usuario'
            });
        }

        // Eliminar el seguimiento
        await seguimiento.destroy();

        res.json({
            success: true,
            message: 'Has dejado de seguir a este usuario'
        });
    } catch (error) {
        console.error('Error al dejar de seguir usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener seguidores de un usuario
export const getSeguidores = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const seguidores = await Seguimientos.findAndCountAll({
            where: { seguido_id: usuario_id },
            include: [{
                model: Usuario,
                as: 'seguidor',
                attributes: ['id', 'username', 'foto_perfil', 'createdAt']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                usuario: {
                    id: usuario.id,
                    username: usuario.username,
                    foto_perfil: usuario.foto_perfil
                },
                seguidores: seguidores.rows.map(seg => ({
                    id: seg.id,
                    fecha_seguimiento: seg.createdAt,
                    seguidor: seg.seguidor
                })),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(seguidores.count / limit),
                    totalItems: seguidores.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Seguidores obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener seguidores:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener usuarios que sigue un usuario
export const getSiguiendo = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const siguiendo = await Seguimientos.findAndCountAll({
            where: { seguidor_id: usuario_id },
            include: [{
                model: Usuario,
                as: 'seguido',
                attributes: ['id', 'username', 'foto_perfil', 'createdAt']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                usuario: {
                    id: usuario.id,
                    username: usuario.username,
                    foto_perfil: usuario.foto_perfil
                },
                siguiendo: siguiendo.rows.map(seg => ({
                    id: seg.id,
                    fecha_seguimiento: seg.createdAt,
                    seguido: seg.seguido
                })),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(siguiendo.count / limit),
                    totalItems: siguiendo.count,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Usuarios seguidos obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener usuarios seguidos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Verificar si un usuario sigue a otro
export const verificarSeguimiento = async (req, res) => {
    try {
        const { seguidor_id, seguido_id } = req.params;

        // Validaciones básicas
        if (!seguidor_id || !seguido_id) {
            return res.status(400).json({
                success: false,
                message: 'seguidor_id y seguido_id son requeridos'
            });
        }

        const seguimiento = await Seguimientos.findOne({
            where: { seguidor_id, seguido_id },
            include: [
                {
                    model: Usuario,
                    as: 'seguidor',
                    attributes: ['id', 'username']
                },
                {
                    model: Usuario,
                    as: 'seguido',
                    attributes: ['id', 'username']
                }
            ]
        });

        res.json({
            success: true,
            data: {
                sigue: !!seguimiento,
                seguimiento: seguimiento || null
            },
            message: seguimiento ? 'El usuario sigue a este usuario' : 'El usuario no sigue a este usuario'
        });
    } catch (error) {
        console.error('Error al verificar seguimiento:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas de seguimiento de un usuario
export const getEstadisticasSeguimiento = async (req, res) => {
    try {
        const { usuario_id } = req.params;

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Contar seguidores y seguidos
        const [totalSeguidores, totalSiguiendo] = await Promise.all([
            Seguimientos.count({ where: { seguido_id: usuario_id } }),
            Seguimientos.count({ where: { seguidor_id: usuario_id } })
        ]);

        res.json({
            success: true,
            data: {
                usuario: {
                    id: usuario.id,
                    username: usuario.username,
                    foto_perfil: usuario.foto_perfil
                },
                estadisticas: {
                    totalSeguidores,
                    totalSiguiendo,
                    ratio: totalSeguidores > 0 ? (totalSiguiendo / totalSeguidores).toFixed(2) : 0
                }
            },
            message: 'Estadísticas de seguimiento obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de seguimiento:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};