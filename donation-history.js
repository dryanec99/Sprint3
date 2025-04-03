// Community Fridge Donation History Management

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayDonationHistory();
});

// Display donation history in the table
function displayDonationHistory() {
  // Get donations from local storage
  const donations = JSON.parse(localStorage.getItem('donations')) || [];
  
  if (donations.length === 0) {
    // If no donations, display a message
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center;">No donation history available. Make your first donation today!</td>
      </tr>
    `;
    return;
  }
  
  // Sort donations by date, newest first
  donations.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
  
  // Get the table body
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';
  
  // Add each donation to the table
  donations.forEach(donation => {
    // Determine status based on expiration date
    const today = new Date();
    const expirationDate = new Date(donation.expiration);
    let status;
    
    if (today > expirationDate) {
      status = 'Expired';
    } else {
      // Random status for demonstration
      const statuses = ['Collected', 'Pending Pickup', 'Reserved'];
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    // Create table row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${donation.donationDate}</td>
      <td>${donation.foodName}</td>
      <td>${donation.quantity}</td>
      <td>${status}</td>
    `;
    
    tableBody.appendChild(row);
  });
} 