// Test script for donation form
console.log('TEST-DONATION.JS LOADED');

// Make a direct test request to the server when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Test donation script initialized');
  
  // First test the API with a GET request
  fetch('/api/donations/test')
    .then(response => response.json())
    .then(data => {
      console.log('API test response:', data);
    })
    .catch(error => {
      console.error('API test error:', error);
    });
  
  // Get the donation form
  const form = document.getElementById('donationForm');
  
  if (!form) {
    console.error('Donation form not found!');
    return;
  }
  
  console.log('Donation form found, attaching test handler');
  
  // Add a test submit handler
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted to test handler');
    
    try {
      // Get user data from local storage
      console.log('Attempting to get user data from localStorage');
      const userDataString = localStorage.getItem('userData');
      console.log('Raw userData from localStorage:', userDataString);
      
      if (!userDataString) {
        console.error('No user data found in localStorage');
        alert('Please log in to donate food. No user data found.');
        window.location.href = '/login';
        return;
      }
      
      const userData = JSON.parse(userDataString);
      console.log('Parsed user data:', userData);
      
      if (!userData || !userData.id) {
        console.error('Invalid user data or missing ID:', userData);
        alert('Please log in to donate food. Invalid user data.');
        window.location.href = '/login';
        return;
      }
      
      // Get form values
      console.log('Getting form values');
      const foodName = document.getElementById('foodName').value;
      const category = document.getElementById('category').value;
      const quantity = document.getElementById('quantity').value;
      const expiration = document.getElementById('expiration').value;
      const description = document.getElementById('description').value;
      
      // Display the values
      console.log('Form values:', {
        foodName,
        category,
        quantity,
        expiration,
        description
      });
      
      // Create donation data
      const donationData = {
        donor_id: userData.id,
        foodName,
        category,
        quantity,
        expiration,
        description
      };
      
      console.log('Donation data to send:', donationData);
      
      // Make a direct test request to the server
      console.log('Sending fetch request to /api/donations');
      fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
      })
      .then(response => {
        console.log('Response received:', response.status, response.statusText);
        console.log('Response headers:', [...response.headers.entries()]);
        return response.text().then(text => {
          try {
            return text ? JSON.parse(text) : {};
          } catch (e) {
            console.error('Error parsing JSON response:', e);
            console.log('Raw response text:', text);
            return { error: 'Invalid JSON response' };
          }
        });
      })
      .then(data => {
        console.log('Parsed response data:', data);
        if (data.success) {
          console.log('Donation successful, showing alert');
          alert('Thank you for your donation! Your food item has been added to our inventory.');
          
          // Reset form
          console.log('Resetting form');
          form.reset();
          
          // Redirect to donation history or donor page after a short delay
          console.log('Setting timeout for redirect');
          setTimeout(() => {
            console.log('Redirecting to /donationhistory');
            window.location.href = '/donationhistory';
          }, 1500);
        } else {
          console.error('Donation failed:', data.error);
          alert('Error: ' + (data.error || 'Failed to submit donation'));
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        alert('Submission error: ' + error.message);
      });
    } catch (error) {
      console.error('Unexpected error in form submission handler:', error);
      alert('An unexpected error occurred: ' + error.message);
    }
  });
});
