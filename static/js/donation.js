// Community Fridge Donation Management System

// Test message to verify script is loading
console.log('DONATION.JS SCRIPT LOADED - TEST MESSAGE');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log('Donation page loaded');
  setupDonationFormSubmission();
  
  // Check if user is logged in
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log('User data from localStorage:', userData);
  if (!userData || !userData.id) {
    // Redirect to login if not logged in
    console.log('User not logged in, redirecting to login page');
    alert('Please log in to donate food');
    window.location.href = '/login.html';
  } else {
    console.log('User is logged in as donor with ID:', userData.id);
  }
});

// Setup form submission for adding new donations
function setupDonationFormSubmission() {
  const form = document.getElementById('donationForm');
  console.log('Donation form found:', !!form);
  
  if (!form) {
    console.error('Donation form not found!');
    return;
  }
  
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    // Get user data from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log('User data at submission:', userData);
    if (!userData || !userData.id) {
      console.log('User not logged in at submission time, redirecting to login');
      alert('Please log in to donate food');
      window.location.href = '/login.html';
      return;
    }
    
    // Get form values
    const foodName = document.getElementById('foodName').value;
    const category = document.getElementById('category').value;
    const quantity = document.getElementById('quantity').value;
    const expiration = document.getElementById('expiration').value;
    const description = document.getElementById('description').value;
    
    console.log('Form values:', {
      foodName,
      category,
      quantity,
      expiration,
      description
    });
    
    // Create donation data object
    const donationData = {
      donor_id: userData.id,
      foodName,
      category,
      quantity,
      expiration,
      description
    };
    
    console.log('Donation data to be sent:', donationData);
    
    try {
      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;
      
      // Send donation data to the server
      console.log('Sending request to /api/donations');
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      // Parse the response
      const result = await response.json();
      console.log('Response data:', result);
      
      // Reset button state
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      
      if (response.ok) {
        // Show success message
        console.log('Donation successful!');
        alert('Thank you for your donation! Your food item has been added to our inventory.');
        
        // Reset form
        form.reset();
        
        // Redirect to donation history or donor page after a short delay
        setTimeout(() => {
          window.location.href = 'donationhistory.html';
        }, 1500);
      } else {
        // Show error message
        console.error('Error from server:', result.error);
        alert('Error: ' + (result.error || 'Failed to submit donation'));
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      console.error('Error details:', error.message, error.stack);
      alert('An error occurred while submitting your donation. Please try again.');
    }
  });
}