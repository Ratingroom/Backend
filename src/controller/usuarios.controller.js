import { Usuario } from '../models/Usuario.js';
import { Reviews } from '../models/Reviews.js';
import { Seguimientos } from '../models/Seguimientos.js';
import { Comentarios } from '../models/Comentarios.js';

// Obtener todos los usuarios
export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'email', 'username', 'fotoPerfil', 'createdAt']
        });
        
        res.json({
            success: true,
            data: usuarios,
            message: 'Usuarios obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};


// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: ['id', 'email', 'username', 'fotoPerfil', 'createdAt'],
            include: [
                {
                    model: Reviews,
                    as: 'reviews',
                    attributes: ['id', 'rating', 'texto', 'pelicula_id', 'createdAt']
                },
                {
                    model: Seguimientos,
                    as: 'seguidores',
                    attributes: ['seguidor_id']
                },
                {
                    model: Seguimientos,
                    as: 'siguiendo',
                    attributes: ['seguido_id']
                }
            ]
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuario,
            message: 'Usuario obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const { email, username, contrasena, fotoPerfil } = req.body;

        // Validaciones básicas
        if (!email || !username || !contrasena) {
            return res.status(400).json({
                success: false,
                message: 'Email, username y contrasena son requeridos'
            });
        }

        // Verificar si el email ya existe
        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        const nuevoUsuario = await Usuario.create({
            email,
            username,
            contrasena,
            fotoPerfil: fotoPerfil || 'https://via.placeholder.com/150'
        });

        // Retornar usuario sin password
        const { contrasena: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

        res.status(201).json({
            success: true,
            data: usuarioSinPassword,
            message: 'Usuario creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        
        // Manejar errores de validación de Sequelize
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

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, username, contrasena, fotoPerfil } = req.body;

        const usuarioExistente = await Usuario.findByPk(id);
        if (!usuarioExistente) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si el nuevo email ya existe (si se está cambiando)
        if (email && email !== usuarioExistente.email) {
            const existingUser = await Usuario.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }
        }

        // Actualizar campos
        const updateData = {};
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        if (contrasena) updateData.contrasena = contrasena;
        if (fotoPerfil) updateData.fotoPerfil = fotoPerfil;

        await usuarioExistente.update(updateData);

        // Retornar usuario actualizado sin password
        const { contrasena: _, ...usuarioActualizado } = usuarioExistente.toJSON();

        res.json({
            success: true,
            data: usuarioActualizado,
            message: 'Usuario actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        
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

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        await usuario.destroy();

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener reviews de un usuario
export const getUsuarioReviews = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const reviews = await Reviews.findAll({
            where: { usuario_id: id },
            attributes: ['id', 'rating', 'texto', 'pelicula_id', 'createdAt']
        });

        res.json({
            success: true,
            data: reviews,
            message: 'Reviews del usuario obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener reviews del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener seguidores de un usuario
export const getUsuarioSeguidores = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const seguidores = await Seguimientos.findAll({
            where: { seguido_id: id },
            include: [{
                model: Usuario,
                as: 'seguidor',
                attributes: ['id', 'username', 'fotoPerfil']
            }]
        });

        res.json({
            success: true,
            data: seguidores,
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

// Obtener usuarios que sigue
export const getUsuarioSiguiendo = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const siguiendo = await Seguimientos.findAll({
            where: { seguidor_id: id },
            include: [{
                model: Usuario,
                as: 'seguido',
                attributes: ['id', 'username', 'fotoPerfil']
            }]
        });

        res.json({
            success: true,
            data: siguiendo,
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