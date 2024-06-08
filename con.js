
import pg  from 'pg';

const getClient = ()=> {

    const db = new pg.Client({
        user: "postgres",
        host: "menially-polite-nuthatch.data-1.use1.tembo.io",
        database: "mec-portal",
        password: '4216mecportalinformationtechnology',
        port: 5432,
        ssl: {
            rejectUnauthorized: false, // Change this based on your SSL certificate requirements
        },
        connectionTimeoutMillis: 30000, // 30 seconds
        idleTimeoutMillis: 30000,       // 30 seconds
    });
    return db;
}


export default {getClient};