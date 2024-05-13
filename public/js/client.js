// Global vars to hold the state of the pages and items
let currentPage = 1; 
let totalPages = 0;
let currentItems = []; 

// Function to load items from the server
function loadItems(page) {
    const sort = document.getElementById('sortOrder').value;
    const url = new URL(`/api/items`, window.location.origin);
    url.searchParams.append('page', page);
    url.searchParams.append('sort', sort); 

    fetch(url)
    .then(response => response.json())
    .then(data => {
        currentPage = page; // Update the current page
        totalPages = data.totalPages; // Update total pages
        displayItems(data.items); // Display the current page items
        updateNavigationButtons(); // Update the buttons state based on current page
    })
    .catch(error => console.error('Error:', error));
}

// Function to display items on the page
function displayItems(items) {
    const itemDisplay = document.getElementById('itemDisplay');
    itemDisplay.innerHTML = ''; // Clear the previous items
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'card';
        itemElement.innerHTML = `
            <img src="${item.image || 'default-placeholder.png'}" alt="${item.name}">
            <div class="card-content">
                <h4 class="card-title">${item.name}</h4>
                <p>Type: ${item.type}</p>
                <p>Description: ${item.description}</p>
                <p>Manufacturer: ${item.manufacturer}</p>
                <p>Shipping Cost: $${item.shipping ? item.shipping.toFixed(2) : 'N/A'}</p>
                <p class="card-text">Price: $${item.price ? item.price.toFixed(2) : 'N/A'}</p>
                <button onclick="saveItem('${item._id}')">❤ Save</button>
            </div>
        `;
        itemDisplay.appendChild(itemElement);
    });
}

// Function to handle the sort by price
function sortItems() {
    const sortOrder = document.getElementById('sortOrder').value;
    if (sortOrder === 'asc') {
        currentItems.sort((a, b) => a.price - b.price);
    } else {
        currentItems.sort((a, b) => b.price - a.price);
    }
    displayItems(currentItems); // Redisplay sorted items
}

// Funciton to nav the different pages of items
function navigateItems(direction) {
    console.log("Clicked Navigate:", direction);
    const newPage = currentPage + direction;
    console.log("Current Page:", currentPage, "Attempting to navigate to:", newPage);

    if (newPage > 0 && newPage <= totalPages) {
        loadItems(newPage);
    } else {
        console.log("Attempt out of valid range.");
    }
}

// Function to update the state of the navigation buttons
function updateNavigationButtons() {
    const prevButton = document.querySelector('button[onclick="navigateItems(-1)"]');
    const nextButton = document.querySelector('button[onclick="navigateItems(1)"]');
    const firstButton = document.querySelector('button[onclick=\'loadItems(1)\']');
    const lastButton = document.querySelector(`button[onclick='loadItems(${totalPages})']`);

    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    firstButton.disabled = currentPage === 1;
    lastButton.disabled = currentPage === totalPages;
}

// Function to add a new item to the catalogue
function addItem() {
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const price = document.getElementById('price').value;
    const shipping = document.getElementById('shipping').value;
    const description = document.getElementById('description').value;
    const manufacturer = document.getElementById('manufacturer').value;
    const image = document.getElementById('image').value;

    // Check if required fields are filled
    if (!name || !type || !price || !shipping || !description || !manufacturer) {
        showNotification('Please fill in all required fields.', 'error');
        return;  // Stop the function if validation fails
    }

    const itemData = {
        name: name,
        type: type,
        price: parseFloat(price),
        shipping: parseFloat(shipping),
        description: description,
        manufacturer: manufacturer,
        image: image  // This can be empty
    };

    fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add item.');
        }
    })
    .then(data => {
        showNotification('Item added successfully!', 'success');
        loadItems();  // Reload items to see the new addition
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to add item. ' + error.message, 'error');
    });
}

// Function to update an existing item in the database
function updateItem() {
    const itemId = document.getElementById('updateId').value;
    const itemData = {
        name: document.getElementById('updateName').value
    };

    fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
    })
    .then(response => {
        if (response.ok) {
            showNotification('Item updated successfully!', 'success');
            loadItems();  // Reload items to see the updates
        } else {
            throw new Error('Failed to update item.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to update item.', 'error');
    });
}

// Function to remove an item from the database
function deleteItem() {
    const itemId = document.getElementById('deleteId').value;

    fetch(`/api/items/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            showNotification('Item deleted successfully!', 'success');
            loadItems();  // Reload items to see the changes
        } else {
            throw new Error('Failed to delete item.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to delete item.', 'error');
    });
}

// Function to search for items in the database by name
function searchItems() {
    const query = document.getElementById('searchQuery').value;
    fetch(`/api/items/search?name=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(items => {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';  // Clear previous results
        if (items.length > 0) {
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'card';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="card-content">
                        <h4 class="card-title">${item.name}</h4>
                        <p>Type: ${item.type}</p>
                        <p>Description: ${item.description}</p>
                        <p>Manufacturer: ${item.manufacturer}</p>
                        <p>Shipping Cost: $${item.shipping.toFixed(2)}</p>
                        <p class="card-text">Price: $${item.price.toFixed(2)}</p>
                        <button onclick="saveItem('${item._id}')">❤ Save</button>
                    </div>
                `;
                resultsContainer.appendChild(itemElement);
            });
        } else {
            showNotification('No items found matching your search.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error performing search.', 'error');
    });
}

// Function to alert the user to status messages
function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    if (!container) {
        console.error("Notification container not found!");
        return;
    }

    const notification = document.createElement('div');
    notification.className = 'notification-message';
    notification.style.backgroundColor = type === 'error' ? '#ffdddd' : '#ddffdd';  // Red for error, green for success
    notification.textContent = message;

    // Add to the DOM and fade in
    container.appendChild(notification);
    notification.classList.add('show');

    // Fade out and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.replace('show', 'hide');
        setTimeout(() => notification.remove(), 500); // Ensure element is removed after fade out
    }, 3000);
}

// Function to save an item to the saveditems collection
function saveItem(itemId) {
    fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: itemId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showNotification('Item saved successfully!', 'success');
    })
    .catch(error => {
        showNotification('Failed to save item.', 'error');
    });
}

// Function to remove an item from the saveditems collection
function unsaveItem(itemId) {
    fetch('/api/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: itemId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to unsave item');
        }
        return response.json();
    })
    .then(data => {
        console.log('Item unsaved:', data);
        document.getElementById(`item-${itemId}`).remove();
        showNotification('Item removed successfully!', 'success');
    })
    .catch(error => {
        console.error('Error unsaving item:', error);
        showNotification('Failed to remove item.', 'error');
    });
}

// Function to load saved items from the server and display them
function loadSavedItems() {
    fetch('/api/saved')
    .then(response => response.json())
    .then(items => {
        const itemsContainer = document.getElementById('savedItems');
        itemsContainer.innerHTML = ''; // Clear previous content
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'card'; // Ensures styling is consistent with home page
            itemElement.id = `item-${item._id}`; // Assign a unique ID
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width:100%; height:200px; object-fit: cover;">
                <div class="card-content">
                    <h4 class="card-title">${item.name}</h4>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text">Price: $${item.price}</p>
                    <button onclick="unsaveItem('${item._id}')">❌ Unsave</button>
                </div>
            `;
            itemsContainer.appendChild(itemElement);
        });
    })
    .catch(error => {
        console.error('Error loading saved items:', error);
        itemsContainer.innerHTML = '<p>Error loading saved items. Please try again later.</p>';
    });
}


// Called when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSavedItems();
});