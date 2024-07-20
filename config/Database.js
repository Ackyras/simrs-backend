import { Sequelize } from "sequelize";

const db = new Sequelize('sql12721052', 'sql12721052', 'XdYG4NWsfJ', {
    host: 'sql12.freesqldatabase.com',
    dialect: 'mysql',
});

export default db;
