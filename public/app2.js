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
    queryDiv.innerHTML = `<h4>${dbType} - Ownership Type, Category, Subcategory Query</h4>
    <p>Configure your query parameters here...</p>`;
    // Add form or inputs here for this specific query
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

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    // Render data as a table
    resultsDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
}

