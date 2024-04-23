const express = require('express');
const app = express();
const port = process.env.PORT || 3913;  // Ensure this port is free on your server
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

// PostgreSQL route
app.post('/query/PostgreSQL', async (req, res) => {
    try {
        const { queryDetails } = req.body;
        const data = await pgPool.query('SELECT * FROM your_table WHERE condition = $1', [queryDetails]);
        res.json(data.rows);
    } catch (error) {
        console.error('Error executing PostgreSQL query:', error);
        res.status(500).send('Failed to retrieve data');
    }
});

// MongoDB route
app.post('/query/MongoDB', async (req, res) => {
    try {
        const { filter, options } = req.body;
        const client = await mongoClient.connect();
        const collection = client.db('yourDatabase').collection('yourCollection');
        const data = await collection.find(filter, options).toArray();
        await client.close();
        res.json(data);
    } catch (error) {
        console.error('Error executing MongoDB query:', error);
        res.status(500).send('Failed to retrieve data');
    }
});

