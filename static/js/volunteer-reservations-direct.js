// Volunteer Reservations Management System - Direct Implementation

// Global variables
let allReservations = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing volunteer reservations management');
  fetchReservations();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchReservations);
  }
  
  // Setup delegation for action buttons
  document.addEventListener('click', function(event) {
    // Approve button
    if (event.target.classList.contains('approve-btn')) {
      const id = parseInt(event.target.getAttribute('data-id'));
      approveReservation(id);
    }
    
    // Cancel button
    if (event.target.classList.contains('cancel-btn')) {
      const id = parseInt(event.target.getAttribute('data-id'));
      cancelReservation(id);
    }
  });
}

// Fetch reservations from API
function fetchReservations() {
  console.log('Fetching reservations from API...');
  
  // Show loading state
  const tableBody = document.getElementById('reservations-table');
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading reservations...</p>
          </div>
        </td>
      </tr>
    `;
  }
  
  // Update refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    refreshBtn.disabled = true;
  }
  
  // Fetch data from API with cache-busting
  const timestamp = new Date().getTime();
  fetch(`/api/reservation/all?t=${timestamp}`)
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched reservations:', data);
      
      // Store reservations
      allReservations = data;
      
      // Display reservations
      displayReservations();
      
      // Reset refresh button
      if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        refreshBtn.disabled = false;
      }
      
      // Show success message
      showMessage('Reservations loaded successfully!', 'success');
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
      
      // Show error message in table
      if (tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="9" class="text-center">
              <div class="error-container">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading reservations: ${error.message}</p>
                <button onclick="fetchReservations()" class="retry-btn">
                  <i class="fas fa-redo"></i> Try Again
                </button>
              </div>
            </td>
          </tr>
        `;
      }
      
      // Reset refresh button
      if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        refreshBtn.disabled = false;
      }
      
      // Show error message
      showMessage('Failed to load reservations. Please try again.', 'error');
      
      // Use mock data for testing
      useMockData();
    });
}

// Use mock data for testing
function useMockData() {
  console.log('Using mock data for testing');
  
  allReservations = [
    {
      id: 1,
      recipientID: 3,
      recipientName: 'Dylan Smith',
      foodID: 1,
      foodName: 'Apples',
      quantity: 2,
      status: 'Confirmed',
      pickupDate: '2025-04-02',
      reservationDate: '2025-03-11',
      location: 'Community Fridge - Camden'
    },
    {
      id: 2,
      recipientID: 5,
      recipientName: 'Bob Wilson',
      foodID: 2,
      foodName: 'Milk',
      quantity: 1,
      status: 'Pending',
      pickupDate: '2025-03-29',
      reservationDate: '2025-03-11',
      location: 'Community Fridge - Brixton'
    }
  ];
  
  displayReservations();
}

// Display reservations
function displayReservations() {
  console.log('Displaying reservations:', allReservations.length);
  
  // Update total count
  const totalCount = document.getElementById('total-count');
  if (totalCount) {
    totalCount.textContent = allReservations.length;
  }
  
  // Get table body
  const tableBody = document.getElementById('reservations-table');
  if (!tableBody) return;
  
  // Clear table
  tableBody.innerHTML = '';
  
  // Check if we have reservations
  if (!allReservations || allReservations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center">
          <div class="empty-container">
            <i class="fas fa-calendar-times"></i>
            <p>No reservations found</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  // Add each reservation to the table
  allReservations.forEach(reservation => {
    // Format dates
    const reservationDate = formatDate(reservation.reservationDate || reservation.created_at);
    const pickupDate = formatDate(reservation.pickupDate);
    
    // Create row
    const row = document.createElement('tr');
    row.setAttribute('data-id', reservation.id || reservation.reservationID);
    
    // Determine status class
    let statusClass = '';
    let statusDisplay = reservation.status || 'Pending';
    
    if (statusDisplay === 'Pending') {
      statusClass = 'status-pending';
    } else if (statusDisplay === 'Confirmed' || statusDisplay === 'Approved') {
      statusClass = 'status-approved';
      statusDisplay = 'Approved';
    } else if (statusDisplay === 'Completed') {
      statusClass = 'status-completed';
    } else if (statusDisplay === 'Cancelled' || statusDisplay === 'Canceled') {
      statusClass = 'status-cancelled';
      statusDisplay = 'Cancelled';
    }
    
    // Set row content
    row.innerHTML = `
      <td>${reservation.id || reservation.reservationID}</td>
      <td>${reservationDate}</td>
      <td>${reservation.foodName || 'Unknown Item'}</td>
      <td>${reservation.quantity || 1}</td>
      <td>${reservation.recipientName || `Recipient #${reservation.recipientID}`}</td>
      <td>${pickupDate}</td>
      <td>${reservation.location || 'Not specified'}</td>
      <td><span class="status-badge ${statusClass}">${statusDisplay}</span></td>
      <td class="action-buttons">
        ${statusDisplay === 'Pending' ? 
          `<button class="approve-btn" data-id="${reservation.id || reservation.reservationID}">
            <i class="fas fa-check"></i> Approve
          </button>` : ''}
        <button class="cancel-btn" data-id="${reservation.id || reservation.reservationID}">
          <i class="fas fa-times"></i> Cancel
        </button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Approve reservation
function approveReservation(id) {
  console.log('Approving reservation:', id);
  
  // Confirm with user
  if (!confirm('Are you sure you want to approve this reservation?')) {
    return;
  }
  
  // Show loading state
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    const actionsCell = row.querySelector('.action-buttons');
    if (actionsCell) {
      actionsCell.innerHTML = '<div class="loading-spinner small"></div>';
    }
  }
  
  // Send request to server
  fetch(`/api/reservation/${id}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'Confirmed' })
  })
    .then(response => {
      console.log('Approve response status:', response.status);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Approve response:', data);
      
      // Show success message
      showMessage('Reservation approved successfully!', 'success');
      
      // Refresh reservations
      fetchReservations();
    })
    .catch(error => {
      console.error('Error approving reservation:', error);
      
      // Show error message
      showMessage('Failed to approve reservation: ' + error.message, 'error');
      
      // Refresh reservations
      fetchReservations();
    });
}

// Cancel reservation
function cancelReservation(id) {
  console.log('Cancelling reservation:', id);
  
  // Confirm with user
  if (!confirm('Are you sure you want to cancel this reservation?')) {
    return;
  }
  
  // Show loading state
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    const actionsCell = row.querySelector('.action-buttons');
    if (actionsCell) {
      actionsCell.innerHTML = '<div class="loading-spinner small"></div>';
    }
  }
  
  // Send request to server
  fetch(`/api/reservation/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log('Cancel response status:', response.status);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Cancel response:', data);
      
      // Show success message
      showMessage('Reservation cancelled successfully!', 'success');
      
      // Refresh reservations
      fetchReservations();
    })
    .catch(error => {
      console.error('Error cancelling reservation:', error);
      
      // Show error message
      showMessage('Failed to cancel reservation: ' + error.message, 'error');
      
      // Refresh reservations
      fetchReservations();
    });
}

// Show message
function showMessage(message, type = 'info') {
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  messageElement.innerHTML = `
    <div class="message-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="message-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to document
  const messagesContainer = document.getElementById('messages-container');
  if (messagesContainer) {
    messagesContainer.appendChild(messageElement);
  } else {
    // Create container if it doesn't exist
    const container = document.createElement('div');
    container.id = 'messages-container';
    container.className = 'messages-container';
    container.appendChild(messageElement);
    document.body.appendChild(container);
  }
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageElement.parentElement) {
      messageElement.classList.add('message-hiding');
      setTimeout(() => {
        if (messageElement.parentElement) {
          messageElement.remove();
        }
      }, 300);
    }
  }, 5000);
}
