const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // ensure this environment variable is set in your .env file or environment
    ssl: {
        rejectUnauthorized: false // This might be needed if you're using Heroku or another cloud provider
    }
});

module.exports = pool;

