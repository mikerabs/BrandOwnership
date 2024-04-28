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




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // Serve static files from 'public' directory


//Functions

async function fetchWikipediaImage(searchTerm) {
    // First, find the Wikipedia page for the brand
    let pageUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json`;
    try {
        let response = await fetch(pageUrl);
        let data = await response.json();
        let pageId = data.query.search[0].pageid; // Get the page ID of the first search result

        // Then, fetch the page details to get the main image
        let imageUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&format=json&pithumbsize=500`;
        response = await fetch(imageUrl);
        data = await response.json();
        let imageData = data.query.pages[pageId].thumbnail.source;

        return imageData;
    } catch (error) {
        console.error('Failed to retrieve image from Wikipedia:', error);
        return null; // Return null if there's an error or no image found
    }
}



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
        res.status(400).send('Invalid database type selected');
    }
});
app.get('/api/brand-details', async (req, res) => {
    const { brand } = req.query; // Assuming 'brand' is a unique identifier or name passed as a query parameter

    // Adjusted SQL query to retrieve detailed information
    const query = `
        SELECT 
            b.Brand,
            o.Owner,
            o.Ownership_Type,
            c.Category_Name,
            s.Subcategory_Name,
            b.Notes
        FROM 
            Brands2 b
        JOIN 
            Owners2 o ON b.Owner_ID = o.Owner_ID
        JOIN 
            BrandSubcategoryJunction2 bsj ON b.Brand_ID = bsj.Brand_ID
        JOIN 
            Subcategories2 s ON bsj.Subcategory_ID = s.Subcategory_ID
        JOIN 
            Categories2 c ON s.Category_ID = c.Category_ID
        WHERE 
            b.Brand = $1;`;

    try {
	console.log("Attempting Query");
        const { rows } = await pgPool.query(query, [brand]); // Execute the query with the brand parameter
	console.log("Queried successfully")
        if (rows.length > 0) {
            const imageUrl = await fetchWikipediaImage(brand); // Fetch the image URL from Wikipedia
	    console.log("Image Found")
            const brandDetails = {...rows[0], imageUrl}; // Combine SQL data with the image URL
            res.json(brandDetails);
        } else {
            res.status(404).send('Brand not found');
        }
    } catch (error) {
        console.error('Failed to retrieve brand details:', error);
        res.status(500).send('Server error');
    }
});

