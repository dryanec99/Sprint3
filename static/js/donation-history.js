// Community Fridge Donation History Management

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData || !userData.id) {
    // Redirect to login if not logged in
    alert('Please log in to view your donation history');
    window.location.href = '/login.html';
    return;
  }
  
  // Display donation history
  fetchAndDisplayDonationHistory(userData.id);
});

// Fetch donation history from server and display in the table
async function fetchAndDisplayDonationHistory(donorId) {
  try {
    // Show loading state
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center;">Loading donation history...</td>
      </tr>
    `;
    
    // Fetch donations from server
    const response = await fetch(`/api/donations/donor/${donorId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donation history');
    }
    
    const donations = await response.json();
    
    if (donations.length === 0) {
      // If no donations, display a message
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center;">No donation history available. Make your first donation today!</td>
        </tr>
      `;
      return;
    }
    
    // Clear the table
    tableBody.innerHTML = '';
    
    // Add each donation to the table
    donations.forEach(donation => {
      // Format dates
      const donationDate = new Date(donation.donation_date).toLocaleDateString();
      const expiryDate = new Date(donation.expiry_date).toLocaleDateString();
      
      // Determine status based on expiration date
      const today = new Date();
      const expirationDate = new Date(donation.expiry_date);
      let status;
      
      if (today > expirationDate) {
        status = 'Expired';
      } else {
        // For now, we'll assume all non-expired items are available
        status = 'Available';
      }
      
      // Create table row
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${donationDate}</td>
        <td>${donation.food_name}</td>
        <td>${donation.quantity}</td>
        <td>${status}</td>
      `;
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    
    // Show error message
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center;">Error loading donation history. Please try again later.</td>
      </tr>
    `;
  }
}