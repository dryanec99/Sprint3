// Community Fridge Donation Management System

// Store donations in local storage
let donations = JSON.parse(localStorage.getItem('donations')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  setupDonationFormSubmission();
});

// Setup form submission for adding new donations
function setupDonationFormSubmission() {
  const form = document.querySelector('form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values
    const foodName = document.getElementById('foodName').value;
    const category = document.getElementById('category').value;
    const quantity = document.getElementById('quantity').value;
    const expiration = document.getElementById('expiration').value;
    const description = document.getElementById('description').value;
    
    // Create new donation object
    const newDonation = {
      id: Date.now(), // Use timestamp as unique ID
      foodName,
      category,
      quantity: quantity + (category === 'Canned Goods' ? ' cans' : ' kg'),
      expiration,
      description,
      donationDate: new Date().toISOString().split('T')[0] // Today's date
    };
    
    // Add to donations array
    donations.push(newDonation);
    
    // Save to local storage
    localStorage.setItem('donations', JSON.stringify(donations));
    
    // Update inventory if needed
    updateInventory(newDonation);
    
    // Reset form
    form.reset();
    
    // Show success message
    alert('Thank you for your donation! Your food item has been added to our inventory.');
    
    // Redirect to donation history or donor page after a short delay
    setTimeout(() => {
      window.location.href = 'donationhistory.html';
    }, 1500);
  });
}

// Update the inventory with the new donation
function updateInventory(donation) {
  // Get inventory items from local storage
  let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  
  // Add the donation to inventory
  inventoryItems.push({
    id: donation.id,
    name: donation.foodName,
    category: donation.category,
    quantity: donation.quantity,
    expiration: donation.expiration
  });
  
  // Save updated inventory
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
} 