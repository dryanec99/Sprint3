// Volunteer Reservations Dashboard JavaScript

// Global variables
let allReservations = [];
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 10;
let searchTerm = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing volunteer reservations dashboard');
  
  // Setup event listeners
  setupEventListeners();
  
  // Load reservations
  fetchReservations();
});

// Setup event listeners
function setupEventListeners() {
  // Filter dropdown
  const filterLinks = document.querySelectorAll('.filter-dropdown-content a');
  filterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      currentFilter = this.getAttribute('data-filter');
      console.log('Filter changed to:', currentFilter);
      currentPage = 1; // Reset to first page when filtering
      displayReservations();
    });
  });
  
  // Search input
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', function() {
    searchTerm = this.value.toLowerCase();
    console.log('Search term changed to:', searchTerm);
    currentPage = 1; // Reset to first page when searching
    displayReservations();
  });
}

// Fetch reservations from API
async function fetchReservations() {
  console.log('Fetching reservations...');
  
  // Show loading spinner
  const loadingSpinner = document.getElementById('loading-spinner');
  if (loadingSpinner) loadingSpinner.style.display = 'block';
  
  // Clear table
  const tableBody = document.getElementById('reservations-table-body');
  if (tableBody) tableBody.innerHTML = '';
  
  // Hide empty state
  const emptyState = document.getElementById('empty-state');
  if (emptyState) emptyState.style.display = 'none';
  
  try {
    // Fetch data from API
    const response = await fetch('/api/reservation/all');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched reservations:', data);
    console.log('Number of reservations:', data.length);
    
    if (data.length === 0) {
      // Show empty state if no reservations
      if (emptyState) emptyState.style.display = 'block';
      if (loadingSpinner) loadingSpinner.style.display = 'none';
      return;
    }
    
    // Process the data
    allReservations = data.map(item => {
      // Format dates
      const reservationDate = item.reservationDate || item.created_at;
      const formattedReservationDate = reservationDate ? new Date(reservationDate).toLocaleDateString() : 'N/A';
      const formattedPickupDate = item.pickupDate ? new Date(item.pickupDate).toLocaleDateString() : 'N/A';
      
      // Map status values
      let status = (item.status || 'Pending').toString();
      if (status === 'Confirmed') status = 'Approved';
      
      // Map recipient names based on our memory of user IDs
      let recipientName = item.recipientName || '';
      if (!recipientName && item.recipientID) {
        // Use our memory of user IDs to map to names
        if (item.recipientID === 3) recipientName = 'Dylan Smith';
        else if (item.recipientID === 5) recipientName = 'Bob Wilson';
        else recipientName = `Recipient #${item.recipientID}`;
      }
      
      // Map food names if not provided
      let foodName = item.foodName || '';
      if (!foodName && item.foodID) {
        // Map common food IDs to names
        if (item.foodID === 1) foodName = 'Apples';
        else if (item.foodID === 2) foodName = 'Milk';
        else if (item.foodID === 3) foodName = 'Rice';
        else if (item.foodID === 4) foodName = 'Chicken Breast';
        else if (item.foodID === 5) foodName = 'Canned Beans';
        else foodName = `Food #${item.foodID}`;
      }
      
      return {
        id: item.id || item.reservationID,
        date: formattedReservationDate,
        recipientName: recipientName,
        foodName: foodName,
        quantity: item.quantity || 1,
        pickupDate: formattedPickupDate,
        location: item.location || 'Community Fridge',
        status: status
      };
    });
    
    // Update UI
    updateStatistics();
    displayReservations();
    
  } catch (error) {
    console.error('Error fetching reservations:', error);
    
    // Show error message
    if (emptyState) {
      emptyState.innerHTML = `
        <div class="empty-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Error Loading Reservations</h3>
        <p class="empty-text">${error.message}</p>
      `;
      emptyState.style.display = 'block';
    }
  } finally {
    // Hide loading spinner
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }
}

// Show error message
function showError(message) {
  document.getElementById('loading-spinner').style.display = 'none';
  document.getElementById('empty-state').style.display = 'block';
  document.getElementById('empty-state').innerHTML = `
    <div class="empty-icon">
      <i class="fas fa-exclamation-circle"></i>
    </div>
    <h3>Error Loading Reservations</h3>
    <p class="empty-text">${message}</p>
  `;
}

// Process reservations data
function processReservations(data) {
  console.log('Processing reservations data...');
  console.log('Raw data sample:', JSON.stringify(data.slice(0, 2)));
  
  // Convert API data to our format
  allReservations = data.map(item => {
    // Format dates
    const reservationDate = item.reservationDate || item.created_at;
    const formattedReservationDate = reservationDate ? new Date(reservationDate).toLocaleDateString() : 'N/A';
    const formattedPickupDate = item.pickupDate ? new Date(item.pickupDate).toLocaleDateString() : 'N/A';
    
    // Map status values - handle both 'Confirmed' and 'Approved' cases
    let status = (item.status || 'Pending').toString();
    if (status === 'Confirmed') status = 'Approved';
    
    // Ensure we have valid IDs
    const reservationID = item.reservationID || item.id || 0;
    const recipientID = item.recipientID || 0;
    const foodID = item.foodID || 0;
    
    // Get recipient name from the memory if available
    let recipientName = item.recipientName || '';
    if (!recipientName) {
      // Map recipient IDs to names based on our memory
      if (recipientID === 3) recipientName = 'Dylan Smith';
      else if (recipientID === 5) recipientName = 'Bob Wilson';
      else recipientName = `Recipient #${recipientID}`;
    }
    
    // Get food name if not provided
    let foodName = item.foodName || '';
    if (!foodName) {
      // Map food IDs to names based on our memory
      if (foodID === 1) foodName = 'Apples';
      else if (foodID === 2) foodName = 'Milk';
      else if (foodID === 3) foodName = 'Rice';
      else if (foodID === 4) foodName = 'Chicken Breast';
      else if (foodID === 5) foodName = 'Canned Beans';
      else foodName = `Food Item #${foodID}`;
    }
    
    console.log(`Processing reservation ${reservationID} with status ${status}`);
    
    return {
      id: reservationID,
      date: formattedReservationDate,
      recipientId: recipientID,
      recipientName: recipientName,
      foodId: foodID,
      foodName: foodName,
      quantity: item.quantity || 1,
      pickupDate: formattedPickupDate,
      location: item.location || 'Community Fridge',
      status: status,
      expirationDate: item.expirationDate || 'N/A'
    };
  });
  
  console.log('Processed reservations:', allReservations.length);
  
  // Update UI
  updateStatistics();
  displayReservations();
  
  // Hide loading spinner
  document.getElementById('loading-spinner').style.display = 'none';
}

// Update statistics
function updateStatistics() {
  const pendingCount = allReservations.filter(r => r.status.toLowerCase() === 'pending').length;
  const approvedCount = allReservations.filter(r => r.status.toLowerCase() === 'approved').length;
  const cancelledCount = allReservations.filter(r => r.status.toLowerCase() === 'cancelled').length;
  const totalCount = allReservations.length;
  
  // Update UI elements if they exist
  const updateElement = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  };
  
  updateElement('pending-count', pendingCount);
  updateElement('approved-count', approvedCount);
  updateElement('cancelled-count', cancelledCount);
  updateElement('total-count', totalCount);
  
  console.log('Statistics updated:', { pending: pendingCount, approved: approvedCount, cancelled: cancelledCount, total: totalCount });
}

// Display reservations
function displayReservations() {
  console.log('Displaying reservations...');
  
  const tableBody = document.getElementById('reservations-table-body');
  if (!tableBody) {
    console.error('Table body element not found!');
    return;
  }
  
  // Apply filters
  let filteredReservations = allReservations;
  console.log('Total reservations:', allReservations.length);
  
  // Filter by status
  if (currentFilter !== 'all') {
    filteredReservations = filteredReservations.filter(r => 
      r.status.toLowerCase() === currentFilter.toLowerCase()
    );
    console.log(`Filtered by status '${currentFilter}':`, filteredReservations.length);
  }
  
  // Filter by search term
  if (searchTerm) {
    filteredReservations = filteredReservations.filter(r => 
      (r.recipientName && r.recipientName.toLowerCase().includes(searchTerm)) ||
      (r.foodName && r.foodName.toLowerCase().includes(searchTerm)) ||
      (r.location && r.location.toLowerCase().includes(searchTerm)) ||
      (r.id && r.id.toString().includes(searchTerm))
    );
    console.log(`Filtered by search term '${searchTerm}':`, filteredReservations.length);
  }
  
  // Check if we have any reservations after filtering
  if (filteredReservations.length === 0) {
    tableBody.innerHTML = '';
    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  // Hide empty state
  const emptyState = document.getElementById('empty-state');
  if (emptyState) emptyState.style.display = 'none';
  
  // Clear table
  tableBody.innerHTML = '';
  
  // Add rows to table
  filteredReservations.forEach(reservation => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', reservation.id);
    
    // Create status badge
    let statusBadge = '';
    let actionButtons = '';
    
    if (reservation.status.toLowerCase() === 'pending') {
      statusBadge = `<span class="status-badge status-pending">Pending</span>`;
      actionButtons = `
        <button class="action-btn approve-btn" onclick="approveReservation(${reservation.id})">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="action-btn cancel-btn" onclick="cancelReservation(${reservation.id})">
          <i class="fas fa-times"></i> Cancel
        </button>
      `;
    } else if (reservation.status.toLowerCase() === 'approved') {
      statusBadge = `<span class="status-badge status-approved">Approved</span>`;
      actionButtons = `
        <button class="action-btn view-btn" onclick="viewReservationDetails(${reservation.id})">
          <i class="fas fa-eye"></i> View
        </button>
      `;
    } else {
      statusBadge = `<span class="status-badge status-cancelled">Cancelled</span>`;
      actionButtons = `
        <button class="action-btn view-btn" onclick="viewReservationDetails(${reservation.id})">
          <i class="fas fa-eye"></i> View
        </button>
      `;
    }
    
    // Match the format shown in the screenshots
    row.innerHTML = `
      <td>${reservation.id}</td>
      <td>${reservation.date}</td>
      <td>${reservation.recipientName}</td>
      <td>${reservation.foodName}</td>
      <td>${reservation.pickupDate}</td>
      <td>${reservation.location}</td>
      <td>${statusBadge}</td>
      <td class="action-buttons">
        ${actionButtons}
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  console.log('Displayed reservations:', filteredReservations.length);
}

// Update pagination
function updatePagination(totalItems) {
  const paginationElement = document.getElementById('pagination');
  if (!paginationElement) {
    console.error('Pagination element not found!');
    return;
  }
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log(`Updating pagination: ${totalItems} items, ${totalPages} pages`);
  
  if (totalPages <= 1) {
    paginationElement.style.display = 'none';
    return;
  }
  
  paginationElement.style.display = 'flex';
  
  let paginationHTML = '';
  
  // Previous button
  paginationHTML += `
    <button class="pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}" 
      ${currentPage === 1 ? 'disabled' : 'onclick="changePage(' + (currentPage - 1) + ')"'}>
      <i class="fas fa-chevron-left"></i> Previous
    </button>
  `;
  
  // Page numbers
  paginationHTML += '<div class="pagination-pages">';
  
  // Determine which page numbers to show
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  // First page
  if (startPage > 1) {
    paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
  }
  
  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
        onclick="changePage(${i})">${i}</button>
    `;
  }
  
  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
    paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  }
  
  paginationHTML += '</div>';
  
  // Next button
  paginationHTML += `
    <button class="pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}" 
      ${currentPage === totalPages ? 'disabled' : 'onclick="changePage(' + (currentPage + 1) + ')"'}>
      Next <i class="fas fa-chevron-right"></i>
    </button>
  `;
  
  paginationElement.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
  currentPage = page;
  console.log('Changed to page:', page);
  displayReservations();
  
  // Scroll to top of table
  document.querySelector('.reservations-container').scrollIntoView({ behavior: 'smooth' });
}

// Approve reservation
function approveReservation(id) {
  console.log('Approving reservation:', id);
  
  const row = document.querySelector(`tr[data-id="${id}"]`);
  
  // Disable buttons to prevent double-clicking
  if (row) {
    const buttons = row.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
    
    // Update the status cell to show processing
    const statusCell = row.querySelector('td:nth-child(7)');
    if (statusCell) {
      statusCell.innerHTML = '<span class="status-badge status-pending">Processing...</span>';
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
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Approval response:', data);
    
    // Refresh data to show updated status
    fetchReservations();
    
    // Show success message if you have a toast function
    if (typeof showToast === 'function') {
      showToast('Reservation approved successfully', 'success');
    } else {
      console.log('Reservation approved successfully');
    }
  })
  .catch(error => {
    console.error('Error approving reservation:', error);
    
    // Show error message
    if (typeof showToast === 'function') {
      showToast('Failed to approve reservation: ' + error.message, 'error');
    } else {
      console.error('Failed to approve reservation:', error.message);
    }
    
    // Re-enable buttons
    if (row) {
      const buttons = row.querySelectorAll('button');
      buttons.forEach(button => button.disabled = false);
      
      // Restore the status cell
      const statusCell = row.querySelector('td:nth-child(7)');
      if (statusCell) {
        statusCell.innerHTML = '<span class="status-badge status-pending">Pending</span>';
      }
    }
    
    // Refresh data
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
  
  const row = document.querySelector(`tr[data-id="${id}"]`);
  
  // Disable buttons to prevent double-clicking
  if (row) {
    const buttons = row.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
    
    // Update the status cell to show processing
    const statusCell = row.querySelector('td:nth-child(7)');
    if (statusCell) {
      statusCell.innerHTML = '<span class="status-badge status-pending">Processing...</span>';
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
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Cancel response:', data);
    
    // Refresh data to show updated status
    fetchReservations();
    
    // Show success message if you have a toast function
    if (typeof showToast === 'function') {
      showToast('Reservation cancelled successfully', 'success');
    } else {
      console.log('Reservation cancelled successfully');
    }
  })
  .catch(error => {
    console.error('Error cancelling reservation:', error);
    
    // Show error message
    if (typeof showToast === 'function') {
      showToast('Failed to cancel reservation: ' + error.message, 'error');
    } else {
      console.error('Failed to cancel reservation:', error.message);
    }
    
    // Re-enable buttons
    if (row) {
      const buttons = row.querySelectorAll('button');
      buttons.forEach(button => button.disabled = false);
      
      // Restore the status cell
      const statusCell = row.querySelector('td:nth-child(7)');
      if (statusCell) {
        statusCell.innerHTML = '<span class="status-badge status-pending">Pending</span>';
      }
    }
    
    // Refresh data
    fetchReservations();
  });
}

// View reservation details
function viewReservationDetails(id) {
  console.log('Viewing reservation details:', id);
  
  // Find the reservation
  const reservation = allReservations.find(r => r.id === id);
  
  if (!reservation) {
    console.error('Reservation not found:', id);
    return;
  }
  
  // Show details in a simple alert (in a real app, this would open a modal)
  alert(`Reservation Details:\n\nID: ${reservation.id}\nDate: ${reservation.date}\nRecipient: ${reservation.recipientName}\nFood Item: ${reservation.foodName}\nPickup Date: ${reservation.pickupDate}\nLocation: ${reservation.location}\nStatus: ${reservation.status}`);
}

// Close modal
function closeModal() {
  document.getElementById('reservation-modal').style.display = 'none';
}

// Refresh reservations
function refreshReservations() {
  console.log('Refreshing reservations...');
  fetchReservations();
}
