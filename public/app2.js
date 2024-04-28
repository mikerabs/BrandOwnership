function loadQueryInterface() {
    const dbType = document.querySelector('input[name="database"]:checked').value;
    const queryInterface = document.getElementById('queryInterface');
    queryInterface.innerHTML = `
        <br><h3>Loading query interface for ${dbType}...</h3>
        <button onclick="setupOwnershipTypeQuery('${dbType}')">Owership Type Search</button>
        <button onclick="setupInterestingBrandsQuery('${dbType}')">Interesting Brands Search</button>
        <button onclick="setupAdvancedSearch('${dbType}')">Advanced Search</button>
    `; 
    // Further dynamic UI loading based on selected database
}

function setupOwnershipTypeQuery(dbType) {
    const queryDiv = document.getElementById('queryInterface');
    queryDiv.innerHTML = `
        <h4>${dbType} - Subcategory Query</h4>
        <form id="ownershipTypeForm">
            <label for="ownershipType">Ownership Type:</label>
            <select id="ownershipType" onchange="updateSubcategoryOptions()">
                <option value="B-corp">B-Corp</option>
                <option value="Co-op">Co-Op</option>
                <option value="complicated">Complicated</option>
                <option value="Employee Owned">Employee Owned</option>
                <option value="Family Owned,Family owned,Family megacorp,Family owned PE backed">Family Owned</option>
                <option value="Farmer’s Cooperative">Farmer’s Cooperative</option>
                <option value="Founder owned, Female founder owned, Founder family owned, Founder owned-mega corp backed, Founder owned/Private equity backed, ' Megacorporate-backed,founder owned'">Founder Owned</option>
                <option value="Megacorporation">Megacorporation</option>
                <option value="Private Company">Private Company</option>
                <option value="Private Equity">Private Equity</option>
                <option value="Private Non-Profit">Private Non-Profit</option>
                <option value="Privately Owned">Privately Owned</option>
                <option value="sketchy">sketchy</option>
                <option value="Corporation (maybe mega?), Founder owned - Probably, Mystery Money, Private Equity?">Unknown</option>
            </select>
            <label for="category">Category:</label>
            <select id="category" onchange="updateSubcategoryOptions()">
                <option value="Fitness">Fitness</option>
                <option value="Food">Food</option>
                <option value="Household & Misc.">Household & Misc.</option>
                <option value="Personal Care">Personal Care</option>
            </select>
            <label for="subcategory">Subcategory:</label>
            <select id="subcategory">
                <!-- Subcategories will be dynamically loaded here -->
            </select>
            <button type="button" onclick="runOwnershipQuery()">Run Query</button>
        </form>
    `;
    updateSubcategoryOptions(); // Initial call to load subcategories for the default category
}

function updateSubcategoryOptions() {
    const category = document.getElementById('category').value;
    const subcategorySelect = document.getElementById('subcategory');
    const subcategories = {
        "Fitness": ["Supplements", "Vitamins"],
        "Food": ["Cereal", "Chips & Snacks", "Baby Food", "Baby Formula", "Pasta Sauce", "Pickles", "Coffee", "Candy", "Frozen Pizza", "Cheese", "Juice", "Drinks", "Sauces & Dressings", "Energy Drinks", "Ice Cream", "Tea", "Crackers"],
        "Household & Misc.": ["Household Cleaners", "Laundry Detergent"],
        "Personal Care": ["Feminine Hygiene", "Deoderant", "Shampoo", "Toothpaste", "Skincare", "Baby Products", "Toilet Paper/Paper Towels"]
    };
    subcategorySelect.innerHTML = subcategories[category].map(sub => `<option value="${sub}">${sub}</option>`).join('');
}


function setupInterestingBrandsQuery(dbType) {
    const queryDiv = document.getElementById('queryInterface');
    queryDiv.innerHTML = `<h4>${dbType} - Interesting Brands Search</h4>
    <p>Search for brands with notes on specific subcategories...</p>`;
    // Add form or inputs here for this specific query
}

function setupAdvancedSearch(dbType) {
    const queryDiv = document.getElementById('queryInterface');
    queryDiv.innerHTML = `<h4>${dbType} - Advanced Search</h4>
    <p>Advanced query setup for Brand, Owner, Ownership Type, Category, and Subcategory.</p>`;
    // Add form or inputs here for this specific query
}

function runQuery() {
    // Build query based on user input and selected database
    const dbType = document.querySelector('input[name="database"]:checked').value;
    // Fetch and display data
    $.ajax({
        url: `/query/${dbType}`,
        method: 'POST',
        data: {
            // query details
        },
        success: function(data) {
            displayResults(data);
        }
    });
}

/*function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    // Render data as a table
    resultsDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
}*/

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

	 if (data.length === 0) {
        // If no data is returned, display a 'No Results Found' message
        resultsDiv.innerHTML = '<p>No Results Found.</p>';
    } else {
    const table = document.createElement('table');
    table.className = 'table table-striped'; // Bootstrap class for styling
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Setting up headers
    const headerRow = document.createElement('tr');
    ['Brand', 'Owner', 'Notes'].forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Inserting data into the table
    data.forEach(row => {
        const tr = document.createElement('tr');
	Object.entries(row).forEach(([key, value]) => {
                const td = document.createElement('td');
                if (key === 'brand') {
                    const a = document.createElement('a');
                    a.href = `brand-details.html?brand=${encodeURIComponent(value)}`;
                    a.textContent = value;
                    td.appendChild(a);
                } else {
                    td.textContent = value;
                }
                tr.appendChild(td);
            });	
       /* Object.values(row).forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            tr.appendChild(td);
        });*/
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    resultsDiv.appendChild(table);
	}
}

// AJAX example for running a query
function runOwnershipQuery() {
    // Collect data from form
    // AJAX POST request to your server with data
    $.ajax({
        url: `/query/ownershipType`,
        type: 'POST',
        data: {
            dbType: document.querySelector('input[name="database"]:checked').value,
            ownershipType: document.getElementById('ownershipType').value,
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value
        },
        success: function(data) {
            displayResults(data);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}

