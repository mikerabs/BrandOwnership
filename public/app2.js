function runQuery() {
    const database = document.querySelector('input[name="database"]:checked').value;
    const query = {}; // Build your query based on user inputs
    $.post('/query', { database, query }, function(data) {
        displayResults(data);
    });
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
}

