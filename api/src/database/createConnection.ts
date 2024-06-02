import { Issue, Project, User, Comment } from 'entities';
import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createDatabaseConnection = () => {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Issue, Comment, User, Project],
    migrations: [`../migrations/*.{ts,js}`],
    synchronize: true,
    logging: false,
  }).initialize();
};

export default createDatabaseConnection;
