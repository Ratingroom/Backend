import { Pelicula } from '../models/Pelicula.js';


export async function getHome(req, res) {
  try {
    const { type = 'pelicula', limit = 30, offset = 0 } = req.query;

    if (type !== 'pelicula') {
      return res.status(200).json([]);
    }

    const rows = await Pelicula.findAll({
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    const data = rows.map(p => ({
      id: p.id,
      titulo: p.titulo ?? p.title ?? '',
      tipo: 'pelicula',
      descripcion: p.descripcion ?? p.overview ?? null,
      image_url: p.poster ?? p.poster_path ?? null,
      created_at: p.createdAt,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error('[GET /home] error:', err);
    res.status(500).json({ message: 'Error al obtener Home' });
  }
}