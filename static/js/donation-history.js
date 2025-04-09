// Community Fridge Donation History Management

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log('Donation history page loaded');
  
  // Add a test element to verify script is running
  const testElement = document.createElement('div');
  testElement.style.padding = '10px';
  testElement.style.backgroundColor = '#ffeb3b';
  testElement.style.color = 'black';
  testElement.style.margin = '10px 0';
  testElement.style.borderRadius = '5px';
  testElement.innerHTML = '<strong>JavaScript is running!</strong> Attempting to fetch donation data...';
  document.querySelector('main').prepend(testElement);
  
  // Check if user is logged in
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  console.log('User data from localStorage:', userData);
  
  // For testing purposes, if no user data is found, use a test donor ID
  let donorId;
  if (!userData || !userData.id) {
    console.log('No user data found, using test donor ID 1');
    donorId = 1; // Use test donor ID 1 (Ray Johnson from the database)
    
    // Create a temporary user data object for display
    const tempUserData = {
      id: donorId,
      name: 'Test Donor (Ray Johnson)',
      email: 'test@example.com',
      role: 'Donor'
    };
    
    // Display user info with test data
    displayUserInfo(tempUserData);
  } else {
    console.log('Using donor ID from localStorage:', userData.id);
    donorId = userData.id;
    
    // Display user info
    displayUserInfo(userData);
  }
  
  // Display donation history
  fetchAndDisplayDonationHistory(donorId);
});

// Display user information
function displayUserInfo(userData) {
  const userInfoSection = document.getElementById('userInfo');
  if (userInfoSection) {
    userInfoSection.innerHTML = `
      <h3>Welcome, ${userData.name || 'Donor'}</h3>
      <p>Email: ${userData.email || 'Not available'}</p>
      <p>Role: ${userData.role || 'Donor'}</p>
      <p>User ID: ${userData.id}</p>
    `;
  }
}

// Fetch donation history from server and display in the tables
async function fetchAndDisplayDonationHistory(donorId) {
  try {
    console.log('Fetching donation history for donor ID:', donorId);
    
    // Show loading state
    const donationsTableBody = document.querySelector('#donationsTable tbody');
    const foodItemsTableBody = document.querySelector('#foodItemsTable tbody');
    
    if (!donationsTableBody || !foodItemsTableBody) {
      console.error('Table elements not found in the DOM!');
      const errorElement = document.createElement('div');
      errorElement.style.padding = '10px';
      errorElement.style.backgroundColor = '#f44336';
      errorElement.style.color = 'white';
      errorElement.style.margin = '10px 0';
      errorElement.style.borderRadius = '5px';
      errorElement.innerHTML = '<strong>Error:</strong> Table elements not found in the DOM!';
      document.querySelector('main').appendChild(errorElement);
      return;
    }
    
    donationsTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">Loading donation history...</td>
      </tr>
    `;
    
    foodItemsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center;">Loading food items...</td>
      </tr>
    `;
    
    // Fetch donations from server
    console.log('Making API request to:', `/api/donations/donor/${donorId}`);
    const response = await fetch(`/api/donations/donor/${donorId}`);
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch donation history: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('Raw API response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('Parsed data:', data);
    
    // Process donations
    const donations = data.donations || [];
    console.log('Donations count:', donations.length);
    
    if (donations.length === 0) {
      // If no donations, display a message
      donationsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center;">No donation history available. Make your first donation today!</td>
        </tr>
      `;
    } else {
      // Clear the table
      donationsTableBody.innerHTML = '';
      
      // Add each donation to the table
      donations.forEach(donation => {
        console.log('Processing donation:', donation);
        
        // Format dates
        const donationDate = donation.donation_date ? new Date(donation.donation_date).toLocaleDateString() : 'N/A';
        const expiryDate = donation.expiry_date ? new Date(donation.expiry_date).toLocaleDateString() : 'N/A';
        
        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${donationDate}</td>
          <td>${donation.food_name || 'N/A'}</td>
          <td>${donation.quantity || 0}</td>
          <td>${expiryDate}</td>
          <td>${donation.notes || 'N/A'}</td>
        `;
        
        donationsTableBody.appendChild(row);
      });
    }
    
    // Process food items
    const foodItems = data.foodItems || [];
    console.log('Food items count:', foodItems.length);
    
    if (foodItems.length === 0) {
      // If no food items, display a message
      foodItemsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center;">No food items available.</td>
        </tr>
      `;
    } else {
      // Clear the table
      foodItemsTableBody.innerHTML = '';
      
      // Add each food item to the table
      foodItems.forEach(item => {
        console.log('Processing food item:', item);
        
        // Format dates
        const createdDate = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A';
        const expiryDate = item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A';
        
        // Set status color
        let statusClass = '';
        switch(item.status) {
          case 'Available':
            statusClass = 'status-available';
            break;
          case 'Reserved':
            statusClass = 'status-reserved';
            break;
          case 'Collected':
            statusClass = 'status-collected';
            break;
          default:
            statusClass = '';
        }
        
        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name || 'N/A'}</td>
          <td>${item.category || 'N/A'}</td>
          <td>${item.quantity || 0}</td>
          <td>${expiryDate}</td>
          <td>${item.fridge_location || 'N/A'}</td>
          <td class="${statusClass}">${item.status || 'N/A'}</td>
          <td>${createdDate}</td>
        `;
        
        foodItemsTableBody.appendChild(row);
      });
    }
    
    // Show the total counts
    const donationsCount = document.getElementById('donationsCount');
    const foodItemsCount = document.getElementById('foodItemsCount');
    
    if (donationsCount) {
      donationsCount.textContent = donations.length;
    }
    
    if (foodItemsCount) {
      foodItemsCount.textContent = foodItems.length;
    }
    
    // Add success message
    const successElement = document.createElement('div');
    successElement.style.padding = '10px';
    successElement.style.backgroundColor = '#4caf50';
    successElement.style.color = 'white';
    successElement.style.margin = '10px 0';
    successElement.style.borderRadius = '5px';
    successElement.innerHTML = `<strong>Success!</strong> Retrieved ${donations.length} donations and ${foodItems.length} food items.`;
    document.querySelector('main').appendChild(successElement);
    
  } catch (error) {
    console.error('Error fetching donation history:', error);
    
    // Show error message
    const donationsTableBody = document.querySelector('#donationsTable tbody');
    const foodItemsTableBody = document.querySelector('#foodItemsTable tbody');
    
    if (donationsTableBody) {
      donationsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center;">Error loading donation history: ${error.message}</td>
        </tr>
      `;
    }
    
    if (foodItemsTableBody) {
      foodItemsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center;">Error loading food items: ${error.message}</td>
        </tr>
      `;
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.style.padding = '10px';
    errorElement.style.backgroundColor = '#f44336';
    errorElement.style.color = 'white';
    errorElement.style.margin = '10px 0';
    errorElement.style.borderRadius = '5px';
    errorElement.innerHTML = `<strong>Error:</strong> ${error.message}`;
    document.querySelector('main').appendChild(errorElement);
  }
}