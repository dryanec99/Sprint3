// Community Fridge Food Reservation System

// Store locations data (would typically come from server)
const locations = [
  { id: 1, name: 'Downtown Community Fridge' },
  { id: 2, name: 'Eastside Community Fridge' },
  { id: 3, name: 'Westside Community Fridge' }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  populateLocations();
  setupFormListeners();
  setupFormSubmission();
});

// Populate the locations dropdown
function populateLocations() {
  const pickupLocation = document.getElementById('pickupLocation');
  
  // Clear existing options
  pickupLocation.innerHTML = '<option value="">Select Location</option>';
  
  // Add locations from our data
  locations.forEach(location => {
    const option = document.createElement('option');
    option.value = location.id;
    option.textContent = location.name;
    pickupLocation.appendChild(option);
  });
}

// Setup listeners for form selections
function setupFormListeners() {
  const pickupLocation = document.getElementById('pickupLocation');
  const foodCategory = document.getElementById('foodCategory');
  const foodItem = document.getElementById('foodItem');
  
  // When location changes, populate categories
  pickupLocation.addEventListener('change', function() {
    const locationId = this.value;
    
    // Clear food category and food item dropdowns
    foodCategory.innerHTML = '<option value="">Select Category</option>';
    foodItem.innerHTML = '<option value="">Select Food Item</option>';
    
    if (locationId) {
      populateCategories(locationId);
    }
  });
  
  // When category changes, populate food items
  foodCategory.addEventListener('change', function() {
    const categoryValue = this.value;
    
    // Clear food item dropdown
    foodItem.innerHTML = '<option value="">Select Food Item</option>';
    
    if (categoryValue) {
      populateFoodItems(categoryValue);
    }
  });
}

// Populate food categories based on inventory
function populateCategories(locationId) {
  const foodCategory = document.getElementById('foodCategory');
  
  // Get inventory from local storage
  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  
  // Get unique categories from inventory
  const categories = [...new Set(inventoryItems.map(item => item.category))];
  
  // Add each category as an option
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    foodCategory.appendChild(option);
  });
}

// Populate food items based on selected category
function populateFoodItems(category) {
  const foodItem = document.getElementById('foodItem');
  
  // Get inventory from local storage
  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  
  // Filter items by category
  const items = inventoryItems.filter(item => item.category === category);
  
  // Add each item as an option
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.name} (${item.quantity}, Expires: ${item.expiration})`;
    foodItem.appendChild(option);
  });
}

// Setup form submission
function setupFormSubmission() {
  const form = document.querySelector('form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values
    const locationSelect = document.getElementById('pickupLocation');
    const foodItemSelect = document.getElementById('foodItem');
    const quantity = document.getElementById('quantity').value;
    const pickupDate = document.getElementById('pickupDate').value;
    const contactInfo = document.getElementById('contactInfo').value;
    const notes = document.getElementById('additionalNotes').value;
    
    // Get the selected location name
    const locationName = locationSelect.options[locationSelect.selectedIndex].text;
    
    // Get inventory items
    const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
    
    // Find the selected food item
    const selectedItemId = parseInt(foodItemSelect.value);
    const selectedItem = inventoryItems.find(item => item.id === selectedItemId);
    
    if (!selectedItem) {
      alert('Please select a valid food item');
      return;
    }
    
    // Create quantity string
    const quantityStr = quantity + (selectedItem.quantity.includes('cans') ? ' cans' : ' kg');
    
    // Import addReservation from reservations.js
    if (typeof addReservation === 'function') {
      // Add the reservation
      const reservation = addReservation(
        selectedItem.name,
        quantityStr,
        pickupDate,
        locationName
      );
      
      // Show success message
      alert('Reservation submitted successfully! You can view your reservations in the reservations page.');
      
      // Reset form
      form.reset();
      
      // Redirect to reservations page after a short delay
      setTimeout(() => {
        window.location.href = 'reservations.html';
      }, 1500);
    } else {
      alert('Reservation system is currently unavailable. Please try again later.');
    }
  });
} 