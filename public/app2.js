function loadQueryInterface() {
    const dbType = document.querySelector('input[name="database"]:checked').value;
    const queryInterface = document.getElementById('queryInterface');
    /*queryInterface.innerHTML = `
        <br><h3>Loading query interface for ${dbType}...</h3>
        <button onclick="setupOwnershipTypeQuery('${dbType}')">Owership Type Search</button>
        <button onclick="setupInterestingBrandsQuery('${dbType}')">Feeling Lucky</button>
        <button onclick="setupAdvancedSearch('${dbType}')">Advanced Search</button>
    `;*/
    queryInterface.innerHTML = `
        <div class="mt-4 mb-4" style="text-align: center;">
            <h3 class="mb-3">Loading query interface for ${dbType}...</h3>
            <div class="d-grid gap-2 d-md-block" style="text-align: center;">	
                <button class="btn btn-primary btn-lg" onclick="setupOwnershipTypeQuery('${dbType}')">Ownership Type Search</button>
                <button class="btn btn-secondary btn-lg"
		onclick="setupInterestingBrandsQuery('${dbType}')">Interesting Brands</button>
                <button class="btn btn-success btn-lg"
		onclick="setupSubcategorySearch('${dbType}')">Subcategory Search</button>
            </div>
        </div>
    `;
    // Further dynamic UI loading based on selected database
}

function setupOwnershipTypeQuery(dbType) {
    const queryDiv = document.getElementById('queryInterface');
    /*queryDiv.innerHTML = `
        <h4>${dbType} - Ownership Type Query</h4>
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
    `;*/
	queryDiv.innerHTML = `
    <h4>${dbType} - Ownership Type Query</h4>
    <form id="ownershipTypeForm" class="mt-3">
        <div class="form-group">
            <label for="ownershipType">Ownership Type:</label>
            <select id="ownershipType" class="form-control" onchange="updateSubcategoryOptions()">
                <!-- options -->
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
        </div>
        <div class="form-group">
            <label for="category">Category:</label>
            <select id="category" class="form-control" onchange="updateSubcategoryOptions()">
                <!-- options -->
		<option value="Fitness">Fitness</option>
                <option value="Food">Food</option>
                <option value="Household & Misc.">Household & Misc.</option>
                <option value="Personal Care">Personal Care</option>
            </select>
        </div>
        <div class="form-group">
            <label for="subcategory">Subcategory:</label>
            <select id="subcategory" class="form-control">
                <!-- Subcategories will be dynamically loaded here -->
            </select>
        </div>
        <button type="button" class="btn btn-primary" onclick="runOwnershipQuery()">Run Query</button>
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
    queryDiv.innerHTML =	`<div style="text-align: center;">
			<button type="button" class="btn btn-primary" onclick="interestingBrandsQuery()">Run Query</button>
			</div>`;
}

function setupSubcategorySearch(dbType) {
    const queryDiv = document.getElementById('queryInterface');
    queryDiv.innerHTML = `<h4>${dbType} - Subcategory Search</h4>
    <form id="subcategoryForm" class="mt-3">
        <div class="form-group">
            <label for="category">Category:</label>
            <select id="category" class="form-control" onchange="updateSubcategoryOptions()">
                <!-- options -->
		<option value="Fitness">Fitness</option>
                <option value="Food">Food</option>
                <option value="Household & Misc.">Household & Misc.</option>
                <option value="Personal Care">Personal Care</option>
            </select>
        </div>
        <div class="form-group">
            <label for="subcategory">Subcategory:</label>
            <select id="subcategory" class="form-control">
                <!-- Subcategories will be dynamically loaded here -->
            </select>
        </div>
        <button type="button" class="btn btn-primary" onclick="subcategoryQuery()">Run Query</button>
    </form>
`;
  
    updateSubcategoryOptions(); // Initial call to load subcategories for the default category
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

function sortTable(n, table) {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc"; 
    // Make a loop that will continue until no switching has been done:
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        // Loop through all table rows (except the first, which contains table headers):
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            // Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            // Check if the two rows should switch place, based on the direction, asc or desc:
            if (dir == "asc") {
                if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            // If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++; 
        } else {
            // If no switching has been done AND the direction is "asc",
            // set the direction to "desc" and run the while loop again.
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function makeSortable(table) {
    var headers = table.getElementsByTagName("TH");
    for (let i = 0; i < headers.length; i++) {
        (function(index){
            headers[i].addEventListener('click', function() {
                sortTable(index, table);
            });
        })(i);
    }
}
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

    data.forEach(row => {
            const tr = document.createElement('tr');
            // Normalize the keys to lowercase to handle differences between databases
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase()] = row[key];
            });

            // Process normalized data
            ['brand', 'owner', 'notes'].forEach(key => {
                const td = document.createElement('td');
                if (key === 'brand') {
                    const a = document.createElement('a');
                    a.href = `brand-details.html?brand=${encodeURIComponent(normalizedRow[key])}`;
                    a.textContent = normalizedRow[key];
                    td.appendChild(a);
                } else {
                    td.textContent = normalizedRow[key] || ''; // Handle undefined cases
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        resultsDiv.appendChild(table);

	makeSortable(table); 
    }    // Inserting data into the table
    /*data.forEach(row => {
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
    
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    resultsDiv.appendChild(table);
	}*/

   // Initialize Sortable on the created table
}
// AJAX example for running a query
function runOwnershipQuery() {
    // Collect data from form
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
function interestingBrandsQuery() {
    // Collect data from form
    $.ajax({
        url: `/query/interestingbrands`,
        type: 'POST',
        data: {
            dbType: document.querySelector('input[name="database"]:checked').value,
        },
        success: function(data) {
            displayResults(data);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}
function subcategoryQuery() {
    // Collect data from form
    $.ajax({
        url: `/query/subcategory`,
        type: 'POST',
        data: {
            dbType: document.querySelector('input[name="database"]:checked').value,
	    category: document.getElementById('category').value,
	    subcategory: document.getElementById('subcategory').value
        },
        success: function(data) {
		displayResultsSubMongo(data);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}
function displayResultsSub(data) {
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
    ['Brand', 'Owner', 'Ownership_Type','Notes'].forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.forEach(row => {
            const tr = document.createElement('tr');
            // Normalize the keys to lowercase to handle differences between databases
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase()] = row[key];
            });

            // Process normalized data
            ['brand', 'owner', 'ownership_type','notes'].forEach(key => {
                const td = document.createElement('td');
                if (key === 'brand') {
                    const a = document.createElement('a');
                    a.href = `brand-details.html?brand=${encodeURIComponent(normalizedRow[key])}`;
                    a.textContent = normalizedRow[key];
                    td.appendChild(a);
                } else {
                    td.textContent = normalizedRow[key] || ''; // Handle undefined cases
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        resultsDiv.appendChild(table);

	makeSortable(table); 
    }    // Inserting data into the table

}

function displayResultsSubMongo(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (data.length === 0) {
        // If no data is returned, display a 'No Results Found' message
        resultsDiv.innerHTML = '<p>No Results Found.</p>';
    } else {
        // Create the table and setup its headers
        const table = document.createElement('table');
        table.className = 'table table-striped'; // Bootstrap class for styling

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Setting up headers
        const headerRow = document.createElement('tr');
        ['Brand', 'Owner', 'Ownership Type', 'Notes'].forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Process each row and normalize keys to lowercase
        data.forEach(row => {
            const tr = document.createElement('tr');

            // Normalize keys, replacing spaces with underscores
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                // Convert to lowercase and replace spaces with underscores
                const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
                normalizedRow[normalizedKey] = row[key];
            });

            // Create table cells using the normalized keys
            ['brand', 'owner', 'ownership_type', 'notes'].forEach(key => {
                const td = document.createElement('td');
                if (key === 'brand') {
                    // Create a clickable link for the brand
                    const a = document.createElement('a');
                    a.href = `brand-details.html?brand=${encodeURIComponent(normalizedRow[key])}`;
                    a.textContent = normalizedRow[key];
                    td.appendChild(a);
                } else {
                    td.textContent = normalizedRow[key] || ''; // Handle undefined cases
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        resultsDiv.appendChild(table);

        // Add sorting functionality (if applicable)
        makeSortable(table);
    }
}

