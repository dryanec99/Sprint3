// Community Fridge View Food System

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayAvailableFood();
});

// Display available food items from inventory
function displayAvailableFood() {
  // Get inventory items from local storage
  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  
  // Get the table body
  const tbody = document.querySelector('tbody');
  
  if (inventoryItems.length === 0) {
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
  
  // Add each inventory item to the table
  inventoryItems.forEach(item => {
    // Determine status - for demo, use random status
    const statuses = ['Available', 'Limited Quantity', 'Fresh'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Randomly assign a location
    const locations = ['Downtown Community Fridge', 'Eastside Community Fridge', 'Westside Community Fridge'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Create table row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${status}</td>
      <td>${item.quantity}</td>
      <td>${item.expiration}</td>
      <td>${location}</td>
    `;
    
    tbody.appendChild(row);
  });
  
  // Add click event to rows to redirect to reserve page
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    row.style.cursor = 'pointer';
    
    row.addEventListener('click', function() {
      // If not a "no items" message row
      if (!row.querySelector('td[colspan="5"]')) {
        window.location.href = 'reservefood.html';
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
} 