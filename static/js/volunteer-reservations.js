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
  // Load reservations
  fetchReservations();
  
  // Setup event listeners
  setupEventListeners();
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
  try {
    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('reservations-table-body').innerHTML = '';
    document.getElementById('empty-state').style.display = 'none';
    
    console.log('Fetching reservations from API...');
    
    // Use XMLHttpRequest for better compatibility
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/manage-reservations/all', true);
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Raw response:', xhr.responseText.substring(0, 100) + '...');
        
        try {
          const data = JSON.parse(xhr.responseText);
          console.log('Fetched reservations:', data.length);
          processReservations(data);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          showError('Invalid response format from server');
        }
      } else {
        console.error('Request failed with status:', xhr.status);
        showError(`Failed to fetch reservations: ${xhr.status}`);
      }
    };
    
    xhr.onerror = function() {
      console.error('Network error occurred');
      showError('Network error occurred while fetching reservations');
    };
    
    xhr.send();
    
  } catch (error) {
    console.error('Error fetching reservations:', error);
    showError(error.message);
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
  
  // Convert API data to our format
  allReservations = data.map(item => {
    // Format dates
    const reservationDate = item.reservationDate ? new Date(item.reservationDate).toLocaleDateString() : 'N/A';
    const pickupDate = item.pickupDate ? new Date(item.pickupDate).toLocaleDateString() : 'N/A';
    
    // Map status values
    let status = item.status || 'Pending';
    if (status === 'Confirmed') status = 'Approved';
    
    return {
      id: item.reservationID,
      date: reservationDate,
      recipientId: item.recipientID,
      recipientName: item.recipientName || `Recipient #${item.recipientID}`,
      foodId: item.foodID,
      foodName: item.foodName || `Food Item #${item.foodID}`,
      quantity: item.quantity || 1,
      pickupDate: pickupDate,
      location: item.location || 'N/A',
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
  
  document.getElementById('pending-count').textContent = pendingCount;
  document.getElementById('approved-count').textContent = approvedCount;
  document.getElementById('cancelled-count').textContent = cancelledCount;
  document.getElementById('total-count').textContent = totalCount;
  
  console.log('Statistics updated:', { pending: pendingCount, approved: approvedCount, cancelled: cancelledCount, total: totalCount });
}

// Display reservations
function displayReservations() {
  console.log('Displaying reservations...');
  
  const tableBody = document.getElementById('reservations-table-body');
  
  // Apply filters
  let filteredReservations = allReservations;
  
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
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('pagination').style.display = 'none';
    return;
  }
  
  // Hide empty state
  document.getElementById('empty-state').style.display = 'none';
  
  // Paginate results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);
  
  // Clear table
  tableBody.innerHTML = '';
  
  // Add rows to table
  paginatedReservations.forEach(reservation => {
    const row = document.createElement('tr');
    
    // Create status badge class
    const statusClass = `status-${reservation.status.toLowerCase()}`;
    
    // Create action buttons based on status
    let actionButtons = '';
    if (reservation.status.toLowerCase() === 'pending') {
      actionButtons = `
        <button class="action-btn approve-btn" onclick="approveReservation(${reservation.id})">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="action-btn cancel-btn" onclick="cancelReservation(${reservation.id})">
          <i class="fas fa-times"></i> Cancel
        </button>
      `;
    } else {
      actionButtons = `
        <button class="action-btn view-btn" onclick="viewReservationDetails(${reservation.id})">
          <i class="fas fa-eye"></i> View
        </button>
      `;
    }
    
    row.innerHTML = `
      <td>${reservation.id}</td>
      <td>${reservation.date}</td>
      <td>${reservation.recipientName}</td>
      <td>${reservation.foodName} (${reservation.quantity})</td>
      <td>${reservation.pickupDate}</td>
      <td>${reservation.location}</td>
      <td><span class="status-badge ${statusClass}">${reservation.status}</span></td>
      <td class="action-buttons">
        ${actionButtons}
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Update pagination
  updatePagination(filteredReservations.length);
  
  console.log('Displayed reservations:', paginatedReservations.length);
}

// Update pagination
function updatePagination(totalItems) {
  const paginationElement = document.getElementById('pagination');
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
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
async function approveReservation(id) {
  try {
    console.log('Approving reservation:', id);
    
    // Show loading state
    const buttons = document.querySelectorAll(`button[onclick="approveReservation(${id})"]`);
    buttons.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Approving...';
      btn.disabled = true;
    });
    
    // Call API to approve reservation
    const response = await fetch(`/api/manage-reservations/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'Approved' })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to approve reservation: ${response.status} ${response.statusText}`);
    }
    
    // Refresh reservations
    await fetchReservations();
    
  } catch (error) {
    console.error('Error approving reservation:', error);
    alert(`Error: ${error.message}`);
    
    // Reset buttons
    const buttons = document.querySelectorAll(`button[onclick="approveReservation(${id})"]`);
    buttons.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-check"></i> Approve';
      btn.disabled = false;
    });
  }
}

// Cancel reservation
async function cancelReservation(id) {
  try {
    console.log('Cancelling reservation:', id);
    
    // Show loading state
    const buttons = document.querySelectorAll(`button[onclick="cancelReservation(${id})"]`);
    buttons.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cancelling...';
      btn.disabled = true;
    });
    
    // Call API to cancel reservation
    const response = await fetch(`/api/manage-reservations/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel reservation: ${response.status} ${response.statusText}`);
    }
    
    // Refresh reservations
    await fetchReservations();
    
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    alert(`Error: ${error.message}`);
    
    // Reset buttons
    const buttons = document.querySelectorAll(`button[onclick="cancelReservation(${id})"]`);
    buttons.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-times"></i> Cancel';
      btn.disabled = false;
    });
  }
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
  
  // Populate modal with reservation details
  const modalDetails = document.getElementById('modal-reservation-details');
  
  modalDetails.innerHTML = `
    <div class="detail-group">
      <div class="detail-label">Reservation ID:</div>
      <div class="detail-value">${reservation.id}</div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Date Created:</div>
      <div class="detail-value">${reservation.date}</div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Status:</div>
      <div class="detail-value">
        <span class="status-badge status-${reservation.status.toLowerCase()}">${reservation.status}</span>
      </div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Recipient:</div>
      <div class="detail-value">${reservation.recipientName} (ID: ${reservation.recipientId})</div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Food Item:</div>
      <div class="detail-value">${reservation.foodName}</div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Quantity:</div>
      <div class="detail-value">${reservation.quantity}</div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Pickup Date:</div>
      <div class="detail-value">${reservation.pickupDate}</div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Location:</div>
      <div class="detail-value">${reservation.location}</div>
    </div>
    <div class="detail-group">
      <div class="detail-label">Expiration Date:</div>
      <div class="detail-value">${reservation.expirationDate}</div>
    </div>
  `;
  
  // Set up action button
  const actionBtn = document.getElementById('modal-action-btn');
  
  if (reservation.status.toLowerCase() === 'pending') {
    actionBtn.textContent = 'Approve';
    actionBtn.className = 'modal-btn approve-modal-btn';
    actionBtn.onclick = function() {
      closeModal();
      approveReservation(reservation.id);
    };
    actionBtn.style.display = 'block';
  } else {
    actionBtn.style.display = 'none';
  }
  
  // Show the modal
  document.getElementById('reservation-modal').style.display = 'flex';
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
