// Community Fridge Reservation Management

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Display user info
  displayUserInfo();
  
  // First try to get userId from URL parameters (highest priority)
  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get('userId');
  
  console.log('User ID from URL:', userId);
  
  // If not in URL, try session storage
  if (!userId) {
    userId = sessionStorage.getItem('userId');
    console.log('User ID from sessionStorage:', userId);
  }
  
  // If not in session storage, try local storage
  if (!userId) {
    userId = localStorage.getItem('userId');
    console.log('User ID from localStorage:', userId);
  }
  
  // Try to get from cookies as last resort
  if (!userId) {
    userId = getCookie('userId');
    console.log('User ID from cookies:', userId);
  }
  
  // Get other user info
  let userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole') || getCookie('userRole');
  let userName = sessionStorage.getItem('userName') || localStorage.getItem('userName') || getCookie('userName');
  
  // Update debug information
  updateDebugInfo({
    userId,
    userRole,
    userName,
    storageCheck: {
      sessionStorage: {
        userId: sessionStorage.getItem('userId'),
        userRole: sessionStorage.getItem('userRole'),
        userName: sessionStorage.getItem('userName')
      },
      localStorage: {
        userId: localStorage.getItem('userId'),
        userRole: localStorage.getItem('userRole'),
        userName: localStorage.getItem('userName')
      },
      cookies: {
        userId: getCookie('userId'),
        userRole: getCookie('userRole'),
        userName: getCookie('userName')
      }
    }
  });
  
  // If no user ID found, use a default for testing
  if (!userId) {
    console.log('No user ID found, using default recipient ID 3');
    userId = '3'; // Use Dylan Smith's ID for testing
    showError('Using test user ID (3) since you are not logged in');
  }
  
  // Fetch and display reservations
  fetchAndDisplayReservations(userId);
});

// Helper function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Display user information
function displayUserInfo() {
  // Try to get user name from multiple sources
  let userName = sessionStorage.getItem('userName');
  if (!userName) userName = localStorage.getItem('userName');
  if (!userName) userName = getCookie('userName');
  
  // Update page title with user name if available
  const pageTitle = document.querySelector('h2');
  if (pageTitle && userName) {
    pageTitle.textContent = `${userName}'s Reservations`;
  }
}

// Update debug information display
function updateDebugInfo(data) {
  const debugContent = document.getElementById('debug-content');
  if (debugContent) {
    // Merge with existing data instead of replacing
    let existingData = {};
    try {
      const currentContent = debugContent.textContent;
      if (currentContent && currentContent !== 'Loading user information...') {
        existingData = JSON.parse(currentContent);
      }
    } catch (e) {
      console.error('Error parsing existing debug data:', e);
    }
    
    // Merge new data with existing data
    const mergedData = { ...existingData, ...data, timestamp: new Date().toISOString() };
    debugContent.textContent = JSON.stringify(mergedData, null, 2);
  }
  
  // Always show debug info when updating
  const debugInfo = document.getElementById('debug-info');
  if (debugInfo) {
    debugInfo.style.display = 'block';
  }
}

// Fetch and display reservations from the API
async function fetchAndDisplayReservations(recipientId) {
  try {
    // Show loading message
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center;">Loading your reservations...</td>
      </tr>
    `;
    
    // Fetch reservations from API
    console.log('Fetching reservations for recipient ID:', recipientId);
    
    // Make sure we have a valid recipient ID
    if (!recipientId) {
      throw new Error('No recipient ID provided');
    }
    
    // Update debug info with API call details
    updateDebugInfo({
      apiCall: {
        endpoint: `/api/recipient-reservations/${recipientId}`,
        recipientId: recipientId,
        timestamp: new Date().toISOString()
      }
    });
    
    // Try a direct fetch to the API endpoint
    const testEndpoint = `/api/recipient-reservations/${recipientId}`;
    console.log('Making API request to:', testEndpoint);
    
    const response = await fetch(testEndpoint);
    console.log('API response status:', response.status, response.statusText);
    
    // Update debug info with response status
    updateDebugInfo({
      apiResponse: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reservations: ${response.status} ${response.statusText}`);
    }
    
    const reservations = await response.json();
    console.log('Reservations data:', reservations);
    
    // Update debug info with reservation data
    updateDebugInfo({
      reservationsData: {
        count: reservations ? reservations.length : 0,
        data: reservations,
        rawResponse: JSON.stringify(reservations).substring(0, 500) + (JSON.stringify(reservations).length > 500 ? '...' : '')
      }
    });
    
    // Check if there are any reservations
    if (!reservations || reservations.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center;">No reservations found. Browse available food and make a reservation!</td>
        </tr>
      `;
      return;
    }
    
    // Clear the table
    tableBody.innerHTML = '';
    
    // Add each reservation to the table
    reservations.forEach(reservation => {
      // Format dates
      const reservationDate = new Date(reservation.reservationDate).toLocaleDateString();
      const pickupDate = new Date(reservation.pickupDate).toLocaleDateString();
      
      // Create table row
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reservationDate}</td>
        <td>${reservation.foodName || 'Unknown Item'}</td>
        <td>${reservation.quantity || 1}</td>
        <td>${pickupDate}</td>
        <td>${reservation.location || 'Not specified'}</td>
        <td>${reservation.status || 'Pending'}</td>
      `;
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    showError(`Failed to load reservations: ${error.message}`);
  }
}

// Show error message in the table
function showError(message) {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align: center; color: red;">${message}</td>
    </tr>
  `;
}

// These functions are no longer needed as we're using the API
// They're kept here for reference but not used

/*
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
  
  return newReservation;
}
*/ 