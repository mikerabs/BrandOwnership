document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');  // Ensure 'brand' is the correct query parameter name

    // Check if 'brand' is not null or undefined
    if (!brand) {
        console.error('Brand parameter is missing');
        return;
    }

    const encodedBrand = encodeURIComponent(brand);
    const url = `/api/brand-details?brand=${encodedBrand}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process data here
        })
        .catch(error => {
            console.error('Failed to fetch brand details:', error);
        });
});

