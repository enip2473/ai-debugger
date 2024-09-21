import { Sequelize } from 'sequelize';

const postgresUrl = process.env.DATABASE_URL;

if (!postgresUrl) {
  throw new Error('Please set DATABASE_URL in environment variables');
}

const sequelize = new Sequelize(postgresUrl);
export default sequelize;