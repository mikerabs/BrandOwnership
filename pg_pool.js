const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // environment variable is set in .env file 
    //ssl: {
       // rejectUnauthorized: false // This might be needed if using Heroku or another cloud provider
   // }
});

module.exports = pool;

