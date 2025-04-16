// Community Fridge Reservation Management System

// Global variables
let allReservations = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing reservation management');
  fetchReservations();
  setupActionButtons();
});

// Fetch reservations from the server
function fetchReservations() {
  console.log('Fetching reservations from server...');
  
  // Show loading indicator
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = `
    <tr>
      <td colspan="9" style="text-align: center;">
        <div style="display: flex; justify-content: center; align-items: center; padding: 20px;">
          <div style="border: 4px solid #f3f3f3; border-top: 4px solid #2e8b57; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite;"></div>
          <span style="margin-left: 10px;">Loading reservations...</span>
        </div>
      </td>
    </tr>
  `;
  
  // Add timestamp to prevent caching
  const timestamp = new Date().getTime();
  
  // Fetch reservations from the API
  fetch(`/api/manage-reservations/all?t=${timestamp}`)
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Fetched reservations data:', data);
      allReservations = data;
      displayAllReservations();
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
      // If fetch fails, use mock data for demo
      useMockData();
    });
}

// Use mock data if fetch fails
function useMockData() {
  console.log('Using mock reservation data');
  
  allReservations = [
    {
      reservationID: 1,
      recipientID: 3,
      foodID: 1,
      status: 'Confirmed',
      pickupDate: '2025-04-02',
      reservationDate: '2025-03-11 15:49:10',
      recipientName: 'Dylan Smith',
      foodName: 'Apples',
      quantity: 2,
      location: 'Community Fridge - Camden'
    },
    {
      reservationID: 2,
      recipientID: 5,
      foodID: 2,
      status: 'Pending',
      pickupDate: '2025-03-29',
      reservationDate: '2025-03-11 15:49:10',
      recipientName: 'Bob Wilson',
      foodName: 'Milk',
      quantity: 1,
      location: 'Community Fridge - Brixton'
    }
  ];
  
  displayAllReservations();
  
  // Show error message
  const errorMsg = document.createElement('div');
  errorMsg.style.backgroundColor = '#ffdddd';
  errorMsg.style.color = '#d8000c';
  errorMsg.style.padding = '10px';
  errorMsg.style.margin = '10px 0';
  errorMsg.style.borderRadius = '5px';
  errorMsg.innerHTML = '<strong>Error:</strong> Could not connect to server. Using demo data instead.';
  
  document.querySelector('main').insertBefore(errorMsg, document.querySelector('table'));
}

// Update total count
function updateTotalCount() {
  const totalCountElement = document.getElementById('total-count');
  if (totalCountElement) {
    totalCountElement.textContent = allReservations.length;
  }
}

// Display all reservations
function displayAllReservations() {
  console.log('Displaying reservations:', allReservations.length);
  
  // Update the total count
  updateTotalCount();
  
  // Get the table body
  const tbody = document.querySelector('tbody');
  
  if (!allReservations || allReservations.length === 0) {
    // If no reservations, display a message
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center;">No reservations have been made yet.</td>
      </tr>
    `;
    return;
  }
  
  // Clear the table
  tbody.innerHTML = '';
  
  // Add each reservation to the table
  allReservations.forEach((reservation, index) => {
    // Format dates
    const reservationDate = reservation.reservationDate ? new Date(reservation.reservationDate).toLocaleDateString() : 'N/A';
    const pickupDate = reservation.pickupDate ? new Date(reservation.pickupDate).toLocaleDateString() : 'N/A';
    
    // Create table row
    const row = document.createElement('tr');
    row.setAttribute('data-id', reservation.reservationID);
    
    row.innerHTML = `
      <td>${reservation.reservationID}</td>
      <td>${reservationDate}</td>
      <td>${reservation.foodName || 'Unknown Item'}</td>
      <td>${reservation.quantity || 1}</td>
      <td>${reservation.recipientName || `Recipient #${reservation.recipientID}`}</td>
      <td>${pickupDate}</td>
      <td>${reservation.location || 'Not specified'}</td>
      <td>${reservation.status || 'Pending'}</td>
      <td class="action-buttons">
        ${reservation.status === 'Pending' ? `<button class="approve-btn" data-id="${reservation.reservationID}">Approve</button>` : ''}
        <button class="cancel-btn" data-id="${reservation.reservationID}">Cancel</button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Setup action buttons (approve/cancel)
function setupActionButtons() {
  document.addEventListener('click', function(event) {
    // Check if clicked element is a button
    if (event.target.tagName === 'BUTTON') {
      const reservationId = parseInt(event.target.getAttribute('data-id'));
      
      // Handle approve button
      if (event.target.classList.contains('approve-btn')) {
        approveReservation(reservationId);
      }
      
      // Handle cancel button
      if (event.target.classList.contains('cancel-btn')) {
        cancelReservation(reservationId);
      }
    }
  });
}

// Approve reservation
function approveReservation(id) {
  console.log('Approving reservation:', id);
  
  // Disable all buttons to prevent double-clicking
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => button.disabled = true);
  
  // Show loading indicator
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    const actionsCell = row.querySelector('.action-buttons');
    actionsCell.innerHTML = '<div style="text-align: center;">Processing...</div>';
  }
  
  // Send update request to server
  fetch(`/api/manage-reservations/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'Confirmed' })
  })
  .then(response => {
    console.log('Approve response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Approve response data:', data);
    
    // Show success message
    showMessage('Reservation approved successfully!', 'success');
    
    // Refresh reservations
    fetchReservations();
  })
  .catch(error => {
    console.error('Error approving reservation:', error);
    
    // Show error message
    showMessage('Failed to approve reservation. Please try again.', 'error');
    
    // Re-enable buttons
    buttons.forEach(button => button.disabled = false);
    
    // Mock successful update for demo if server fails
    if (row) {
      // Find and update the reservation in our local array
      const reservation = allReservations.find(r => r.reservationID === id);
      if (reservation) {
        reservation.status = 'Confirmed';
        displayAllReservations();
      }
    }
  });
}

// Cancel reservation
function cancelReservation(id) {
  if (confirm('Are you sure you want to cancel this reservation?')) {
    console.log('Cancelling reservation:', id);
    
    // Disable all buttons to prevent double-clicking
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
    
    // Show loading indicator
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      const actionsCell = row.querySelector('.action-buttons');
      actionsCell.innerHTML = '<div style="text-align: center;">Processing...</div>';
    }
    
    // Send delete request to server
    fetch(`/api/manage-reservations/reservations/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      console.log('Cancel response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Cancel response data:', data);
      
      // Show success message
      showMessage('Reservation cancelled successfully!', 'error');
      
      // Refresh reservations
      fetchReservations();
    })
    .catch(error => {
      console.error('Error cancelling reservation:', error);
      
      // Show error message
      showMessage('Failed to cancel reservation. Please try again.', 'error');
      
      // Re-enable buttons
      buttons.forEach(button => button.disabled = false);
      
      // Mock successful update for demo if server fails
      if (row) {
        row.remove();
        // Remove from our local array
        const index = allReservations.findIndex(r => r.reservationID === id);
        if (index !== -1) {
          allReservations.splice(index, 1);
          if (allReservations.length === 0) {
            displayAllReservations(); // Show empty state
          }
        }
      }
    });
  }
}

// Show message to user
function showMessage(message, type) {
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.style.position = 'fixed';
  messageElement.style.top = '20px';
  messageElement.style.left = '50%';
  messageElement.style.transform = 'translateX(-50%)';
  messageElement.style.padding = '10px 20px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  messageElement.style.zIndex = '1000';
  messageElement.style.transition = 'opacity 0.5s';
  
  if (type === 'success') {
    messageElement.style.backgroundColor = '#dff2bf';
    messageElement.style.color = '#4f8a10';
  } else if (type === 'error') {
    messageElement.style.backgroundColor = '#ffdddd';
    messageElement.style.color = '#d8000c';
  } else {
    messageElement.style.backgroundColor = '#bde5f8';
    messageElement.style.color = '#00529b';
  }
  
  messageElement.textContent = message;
  
  // Add to document
  document.body.appendChild(messageElement);
  
  // Remove after 3 seconds
  setTimeout(() => {
    messageElement.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(messageElement);
    }, 500);
  }, 3000);
}

// Return item to inventory when a reservation is cancelled
function returnItemToInventory(foodName, quantity) {
  // Get inventory from local storage
  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  
  // Extract numeric quantity value from string (e.g. "5 kg" -> 5)
  const quantityValue = parseInt(quantity.match(/\d+/)[0]);
  
  // Determine unit (kg or cans)
  const unit = quantity.includes('cans') ? ' cans' : ' kg';
  
  // Check if item exists in inventory
  const existingItemIndex = inventoryItems.findIndex(item => item.name === foodName);
  
  if (existingItemIndex !== -1) {
    // Item exists, update quantity
    const currentQuantity = parseInt(inventoryItems[existingItemIndex].quantity.match(/\d+/)[0]);
    inventoryItems[existingItemIndex].quantity = (currentQuantity + quantityValue) + unit;
  } else {
    // Item doesn't exist, add new item
    inventoryItems.push({
      id: Date.now(),
      name: foodName,
      category: 'Other', // Default category since we don't know the original
      quantity: quantityValue + unit,
      expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 7 days from now
    });
  }
  
  // Save updated inventory
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
} 