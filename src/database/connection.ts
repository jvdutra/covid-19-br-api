import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const connection = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      timezone: process.env.TZ || 'America/Sao_Paulo'
    },
    useNullAsDefault: true
});

export default connection;