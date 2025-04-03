// Community Fridge Reservation Management

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayReservations();
});

// Display reservations in the table
function displayReservations() {
  // Get reservations from local storage
  const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
  
  if (reservations.length === 0) {
    // If no reservations, display a message
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center;">No reservations found. Browse available food and make a reservation!</td>
      </tr>
    `;
    return;
  }
  
  // Sort reservations by date, newest first
  reservations.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));
  
  // Get the table body
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';
  
  // Add each reservation to the table
  reservations.forEach(reservation => {
    // Create table row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${reservation.reservationDate}</td>
      <td>${reservation.foodItem}</td>
      <td>${reservation.quantity}</td>
      <td>${reservation.pickupDate}</td>
      <td>${reservation.location}</td>
      <td>${reservation.status}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Add a new reservation (can be called from other pages)
function addReservation(foodItem, quantity, pickupDate, location) {
  // Get existing reservations
  const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
  
  // Create new reservation object
  const newReservation = {
    id: Date.now(),
    reservationDate: new Date().toISOString().split('T')[0], // Today's date
    foodItem,
    quantity,
    pickupDate,
    location,
    status: 'Pending'
  };
  
  // Add to reservations array
  reservations.push(newReservation);
  
  // Save to local storage
  localStorage.setItem('reservations', JSON.stringify(reservations));
  
  // Update inventory to reflect the reservation
  updateInventory(foodItem, quantity);
  
  return newReservation;
}

// Update inventory when an item is reserved
function updateInventory(foodItem, quantityReserved) {
  // Get inventory items
  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  
  // Find the item in inventory
  const itemIndex = inventoryItems.findIndex(item => item.name === foodItem);
  
  if (itemIndex !== -1) {
    // Parse the current quantity value
    const currentQuantity = parseInt(inventoryItems[itemIndex].quantity.match(/\d+/)[0]);
    const reservedQuantity = parseInt(quantityReserved.match(/\d+/)[0]);
    
    // Update quantity
    const newQuantity = currentQuantity - reservedQuantity;
    
    if (newQuantity <= 0) {
      // Remove the item if none left
      inventoryItems.splice(itemIndex, 1);
    } else {
      // Update the quantity
      const unit = inventoryItems[itemIndex].quantity.includes('cans') ? ' cans' : ' kg';
      inventoryItems[itemIndex].quantity = newQuantity + unit;
    }
    
    // Save updated inventory
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
  }
} 