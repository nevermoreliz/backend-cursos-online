const { Op } = require('sequelize');

const paginateModel = async (Model, query, searchFields = [], options = {}) => {

    // 1. Parámetros de paginación desde query params
    // Ejemplo: GET /cursos?page=2&limit=5&search=react&sortBy=nombre_curso&sortOrder=asc
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const search = query.search?.trim() || '';
    const sortBy = query.sortBy || 'id';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Arma el Op.or dinámicamente según los campos que le pases
    const whereSearch = search && searchFields.length > 0
        ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.iLike]: `%${search}%` } })) }
        : {};

    const { count: total, rows: data } = await Model.findAndCountAll({
        ...options,
        where: { ...whereSearch, ...options.where },
        limit,
        offset: (page - 1) * limit,
        order: [[sortBy, sortOrder]]
    });

    return {
        data,
        paginacion: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
};

module.exports = { paginateModel }