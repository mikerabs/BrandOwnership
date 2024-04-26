/*const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // environment variable is set in .env file 
    //ssl: {
       // rejectUnauthorized: false // This might be needed if using Heroku or another cloud provider
   // }
});

module.exports = pool;
*/
const { Pool } = require('pg') // connecting to postgres
const { CommandCompleteMessage, closeComplete } = require('pg-protocol/dist/messages')
const pool = new Pool({
    user: 'dbuser',
    host: 'localhost',
    database: 'mrabayda',
    password: '12345678',
    port: 5432,
  })
console.log("Created pool ", pool)
// in a function that gets called on receiving a web request that calls for data from PostgreSQL:
async function poolTable(req, res) {
    let client = null;
    try {
        client = await pool.connect();
    }  catch (err) {
    } finally {
        if (client != null) {
            client.release();
        }
    }
}

module.exports = pool;
