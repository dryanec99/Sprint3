// Community Fridge Reservation Management System

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayAllReservations();
  setupActionButtons();
});

// Display all reservations
function displayAllReservations() {
  // Get reservations from local storage
  const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
  
  // Get users list for recipient names
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Get the table body
  const tbody = document.querySelector('tbody');
  
  if (reservations.length === 0) {
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
  reservations.forEach((reservation, index) => {
    // Find the recipient user (would be linked in a real application)
    const recipient = users.find(user => user.type === 'recipient') || { username: 'John Doe' };
    
    // Create table row
    const row = document.createElement('tr');
    row.setAttribute('data-id', reservation.id);
    
    row.innerHTML = `
      <td>${100 + index}</td>
      <td>${reservation.reservationDate}</td>
      <td>${reservation.foodItem}</td>
      <td>${reservation.quantity}</td>
      <td>${recipient.username}</td>
      <td>${reservation.pickupDate}</td>
      <td>${reservation.location}</td>
      <td>${reservation.status}</td>
      <td class="action-buttons">
        <button class="approve-btn" data-id="${reservation.id}">Approve</button>
        <button class="cancel-btn" data-id="${reservation.id}">Cancel</button>
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
  // Get reservations from local storage
  const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
  
  // Find the reservation
  const reservation = reservations.find(r => r.id === id);
  
  if (reservation) {
    // Update status
    reservation.status = 'Approved';
    
    // Save to local storage
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    // Refresh the table
    displayAllReservations();
    
    // Show success message
    alert('Reservation approved successfully!');
  }
}

// Cancel reservation
function cancelReservation(id) {
  if (confirm('Are you sure you want to cancel this reservation?')) {
    // Get reservations from local storage
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // Find the reservation
    const reservationIndex = reservations.findIndex(r => r.id === id);
    
    if (reservationIndex !== -1) {
      // Get the reservation
      const reservation = reservations[reservationIndex];
      
      // Return item to inventory
      returnItemToInventory(reservation.foodItem, reservation.quantity);
      
      // Remove from reservations
      reservations.splice(reservationIndex, 1);
      
      // Save to local storage
      localStorage.setItem('reservations', JSON.stringify(reservations));
      
      // Refresh the table
      displayAllReservations();
      
      // Show success message
      alert('Reservation cancelled successfully!');
    }
  }
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