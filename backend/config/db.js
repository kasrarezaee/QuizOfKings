import dotenv from "dotenv";
import pg from "pg"
dotenv.config();
const db = new pg.Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT 
})
db.connect();

export const query = (text , params) => db.query(text , params);
export const closeConnection = () => db.end(); 