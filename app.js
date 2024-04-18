const express = require('express');
const app = express();
const port = process.env.PORT || 3000;  // Ensure this port is free on your server
const mongoClient = require('./db/mongo');
const pgPool = require('./db/postgres');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));  // Serve static files from 'public' directory

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


app.post('/query', async (req, res) => {
    const { database, query } = req.body;
    try {
        if (database === 'MongoDB') {
            const client = await mongoClient.connect();
            const db = client.db('yourDatabase');
            const data = await db.collection('Brands').find(query).toArray();
            client.close();
            res.json(data);
        } else if (database === 'PostgreSQL') {
            const { rows } = await pgPool.query(query);
            res.json(rows);
        }
    } catch (error) {
        res.status(500).send('Error executing the query');
    }
});

