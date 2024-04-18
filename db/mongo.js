const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL;  // MongoDB connection string

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;

