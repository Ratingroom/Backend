import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('RatingRoom', 'postgres', 'admin', {
    port : 5432,
    host: 'localhost',
    dialect: 'postgres'
});