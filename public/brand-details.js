document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');

    if (!brand) {
        document.body.innerHTML = '<p>Error: Brand parameter is missing in the URL.</p>';
        return;
    }

    fetch(`/api/brand-details?brand=${encodeURIComponent(brand)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Ensure the element IDs and data keys match
            document.getElementById('brand-name').textContent = data.brand; // Changed from data.Brand
            document.getElementById('owner').textContent = data.owner; // Changed from data.Owner
            document.getElementById('ownership-type').textContent = data.ownership_type; // Changed from data.Ownership_Type
            document.getElementById('category').textContent = data.category_name; // Changed from data.Category_Name
            document.getElementById('subcategory').textContent = data.subcategory_name; // Changed from data.Subcategory_Name
            document.getElementById('notes').textContent = data.notes; // Changed from data.Notes
        })
        .catch(error => {
            console.error('Failed to fetch brand details:', error);
            document.body.innerHTML = `<p>Error loading brand details: ${error.message}</p>`;
        });
});

