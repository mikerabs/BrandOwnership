require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 30913;  // Ensure this port is free on server
//const mongoClient = require('./db/mongo');
//const pgPool = require('./db/postgres');
const pgPool = require('./pg_pool');  // Importing the pool configured in pgpool.js

//const fetch = require('node-fetch');

// Middleware to parse JSON and URL-encoded data
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017'; // Default MongoDB connection URL for localhost
const mongoClient = new MongoClient(mongoUrl);

async function connectMongoDB() {
    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
    }
}

connectMongoDB();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // Serve static files from 'public' directory


//Functions



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});






app.get('/view-table', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'BON_table.html'));
});


app.post('/query/ownershipType', async (req, res) => {
    const { dbType, ownershipType, category, subcategory } = req.body;

    if (dbType === "PostgreSQL") {
        // Construct the SQL query
        const query = `SELECT
			    b.brand,
			    o.owner,
				b.notes
			    FROM
				brands2 b
			    JOIN
				owners2 o ON b.owner_id = o.owner_id
			    JOIN
				brandsubcategoryjunction2 bsj ON b.brand_id = bsj.brand_id
			    JOIN
			    subcategories2 s ON bsj.subcategory_id = s.subcategory_id
			    JOIN
			    categories2 c ON s.category_id = c.category_id
			    WHERE
			    o.ownership_type = ANY($1::text[]) 
			    AND c.category_name = $2
			    AND s.subcategory_name = $3;
                    `;

	/*SELECT * FROM brands2
            JOIN categories2 ON brands2.category_id = categories2.id
            JOIN subcategories2 ON brands2.subcategory_id = subcategories2.id
            JOIN ownership_types2 ON brands2.ownership_id = ownership_types2.id
            WHERE ownership_types.type = $1 AND categories2.name = $2 AND subcategories2.name = $3;
	*/
        try {
	    const ownershipTypesArray = ownershipType.split(',');
            const { rows } = await pgPool.query(query, [ownershipTypesArray, category, subcategory]);
	    console.log(ownershipType);
	    console.log(ownershipTypesArray);
            res.json(rows); // Send back the results to the client
        } catch (error) {
            console.error('Failed to execute query:', error);
            res.status(500).send('Failed to retrieve data');
        }
    } else {
        // Add MongoDB handling logic here if needed
	try {
            const db = mongoClient.db("mrabayda"); 
            const collection = db.collection("tempBrands"); 

            // Query for documents
	    const documents = await collection.find({
                "Ownership Type": { $in: ownershipType.split(',') },
                "Category": category,
                "Subcategory": subcategory
            }, {
                projection: {
                    _id: 0, // Exclude the _id field
                    Brand: 1, // Include the Brand field
                    Owner: 1, // Include the Owner field
                    Notes: 1 // Include the Notes field
                }}).toArray();

            res.json(documents);            
        } catch (error) {
            console.error('Failed to execute MongoDB query:', error);
            res.status(500).send('Failed to retrieve data from MongoDB');
        }
        //res.status(400).send('Invalid database type selected');
    }
});
app.get('/api/brand-details', async (req, res) => {
   const { brand } = req.query;
    if (!brand) {
        return res.status(400).send("Brand parameter is required.");
    }

    const query = `
        SELECT 
            b.brand,
            o.owner,
            o.ownership_type,
            c.category_name,
            s.subcategory_name,
            b.notes
        FROM 
            brands2 b
        JOIN 
            owners2 o ON b.owner_id = o.owner_id
        JOIN 
            brandsubcategoryjunction2 bsj ON b.brand_id = bsj.brand_id
        JOIN 
            subcategories2 s ON bsj.subcategory_id = s.subcategory_id
        JOIN 
            categories2 c ON s.category_id = c.category_id
        WHERE 
            b.brand = $1;
    `;

    try {
        const { rows } = await pgPool.query(query, [brand.trim()]); // Using trim() to handle any extra whitespace
        if (rows.length > 0) {
            res.json(rows[0]);
		console.log(rows[0]);
        } else {
            res.status(404).send('Brand not found');
        }
    } catch (error) {
        console.error('Failed to retrieve brand details:', error);
        res.status(500).send('Server error');
    } 
});

app.post('/query/interestingbrands', async (req, res) => {

    const { dbType } = req.body;
    if(dbType === "PostgreSQL"){
	const query = `SELECT
			b.brand AS Brand,
			    o.owner AS Owner,
			    o.ownership_type AS Ownership_Type,
			    b.notes AS Notes
			FROM
			    brands2 b
			JOIN
			    owners2 o ON b.owner_id = o.owner_id
			WHERE
			    b.notes IS NOT NULL;
			`; 
	try {
	     const { rows } = await pgPool.query(query);// Using trim() to handle any extra whitespace
	     if (rows.length > 0) {
		 res.json(rows);
		 console.log(rows[0]);
	     } else {
		 res.status(404).send('Brands not found');
	     }
	     } catch (error) {
		 console.error('Failed to retrieve interesting brand details:', error);
		 res.status(500).send('Server error');
	     }
    } else {
	try {
	    const db = mongoClient.db("mrabayda"); 
	    const collection = db.collection("tempBrands");

	    // Query for documents
	    const documents = await collection.find({
		"Notes": { $exists: true, $ne: "" } // Add condition for Notes field
		}, {
		    projection: {
			_id: 0, // Exclude the _id field
			Brand: 1, // Include the Brand field
			Owner: 1, // Include the Owner field
			'Ownership Type': 1,
			Category: 1,
			Subcategory: 1,
			Notes: 1 // Include the Notes field
		    }
		}).toArray();

	    res.json(documents);
	    } catch (error) {
		console.error('Failed to execute MongoDB query:', error);
		res.status(500).send('Failed to retrieve data from MongoDB');
	    }
    } 
	

});
app.post('/query/subcategory', async (req, res) => {
    const { dbType, category, subcategory } = req.body;

    if(dbType === "PostgreSQL"){
	const query = `
        SELECT
            b.brand AS Brand,
            o.owner AS Owner,
            o.ownership_type AS Ownership_Type,
            b.notes AS Notes,
            c.category_name AS Category,
            s.subcategory_name AS Subcategory
        FROM
            brands2 b
        JOIN
            brandsubcategoryjunction2 bsj ON b.brand_id = bsj.brand_id
        JOIN
            subcategories2 s ON bsj.subcategory_id = s.subcategory_id
        JOIN
            categories2 c ON s.category_id = c.category_id
        JOIN
            owners2 o ON b.owner_id = o.owner_id
        WHERE
            c.category_name = $1
        AND
            s.subcategory_name = $2;
	`;

	try {
	    const { rows } = await pgPool.query(query, [category, subcategory]);
	    if (rows.length > 0) {
		res.json(rows);
	    } else {
		res.status(404).send('No brands found matching the specified category and subcategory.');
	    }
	} catch (error) {
	    console.error('Error querying the database:', error);
	    res.status(500).send('Server error');
	}


    }else {
	//Mongo IMplementation	    

	try {
	    const collection = mongoClient.db('mrabayda').collection('tempBrands');

	    const results = await collection.find(
		{
		    Category: category,
		    Subcategory: subcategory
		},
		{
                projection: {
                    Brand: 1,
                    Owner: 1,
                    "Ownership Type": 1,
                    Notes: 1,
                    Category: 1,
                    Subcategory: 1
                }
		}
	    ).toArray();

//	    console.log(results);
	    if (results.length > 0) {
		res.json(results);
	    } else {
		res.status(404).send('No brands found matching the specified category and subcategory.');
	    }
	    } catch (error) {
		console.error('Error querying the database:', error);
		res.status(500).send('Server error');
	    }
    }
});	
