const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.PG_URL  // PostgreSQL connection string
});

module.exports = pool;
