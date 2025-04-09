// Community Fridge View Food System

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  fetchAndDisplayAvailableFood();
});

// Fetch and display available food items from the API
async function fetchAndDisplayAvailableFood() {
  try {
    // Get the table body
    const tbody = document.querySelector('tbody');
    
    // Show loading state
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">Loading food items...</td>
      </tr>
    `;
    
    // Fetch data from the API
    const response = await fetch('/api/food/all');
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse the JSON response
    const foodItems = await response.json();
    
    // Check if there are any food items
    if (foodItems.length === 0) {
      // If no items, display a message
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center;">No food items are currently available. Please check back later.</td>
        </tr>
      `;
      return;
    }
    
    // Clear the table
    tbody.innerHTML = '';
    
    // Add each food item to the table
    foodItems.forEach(item => {
      // Create table row
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.status}</td>
        <td>${item.quantity}</td>
        <td>${formatDate(item.expirationDate)}</td>
        <td>${item.location}</td>
      `;
      
      // Add data attribute for the food ID
      row.setAttribute('data-food-id', item.foodID);
      
      tbody.appendChild(row);
    });
    
    // Add click event to rows to redirect to reserve page
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      row.style.cursor = 'pointer';
      
      row.addEventListener('click', function() {
        // If not a "no items" message row
        if (!row.querySelector('td[colspan="5"]')) {
          const foodId = row.getAttribute('data-food-id');
          window.location.href = `reservefood.html?foodId=${foodId}`;
        }
      });
      
      // Add hover effect
      row.addEventListener('mouseenter', function() {
        if (!row.querySelector('td[colspan="5"]')) {
          row.style.backgroundColor = '#e8f5e9';
        }
      });
      
      row.addEventListener('mouseleave', function() {
        if (!row.querySelector('td[colspan="5"]')) {
          row.style.backgroundColor = '';
        }
      });
    });
  } catch (error) {
    console.error('Error fetching food items:', error);
    // Display error message
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">Error loading food items. Please try again later.</td>
      </tr>
    `;
  }
}

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}