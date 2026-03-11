import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ override: true });
console.log("Using database:", process.env.DB_NAME);

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default connection;
