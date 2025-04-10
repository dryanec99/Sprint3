// Basket Reservation System for Community Fridge
document.addEventListener('DOMContentLoaded', function() {
  const basketItemsList = document.getElementById('basketItemsList');
  const pickupLocationSelect = document.getElementById('pickupLocation');
  const reservationForm = document.getElementById('reservationForm');
  
  // Get basket items from localStorage
  const basket = JSON.parse(localStorage.getItem('foodBasket')) || [];
  
  console.log('Basket items from localStorage:', basket);
  
  // Check if basket is empty
  if (basket.length === 0) {
    basketItemsList.innerHTML = `
      <div class="empty-basket">
        <p>Your basket is empty. Please go back to <a href="/viewfood">Available Food</a> and select items to reserve.</p>
      </div>
    `;
    reservationForm.style.display = 'none';
    return;
  }
  
  // Display basket items
  displayBasketItems();
  
  // Populate pickup locations based on basket items
  populatePickupLocations();
  
  // Handle form submission
  reservationForm.addEventListener('submit', handleReservationSubmit);
  
  // Display basket items in the summary section
  function displayBasketItems() {
    console.log('Displaying basket items:', basket);
    basketItemsList.innerHTML = '';
    
    if (!basket || basket.length === 0) {
      basketItemsList.innerHTML = `
        <div class="empty-basket">
          <p>Your basket is empty. Please go back to <a href="/viewfood">Available Food</a> and select items to reserve.</p>
        </div>
      `;
      return;
    }
    
    // Create table for basket items
    const table = document.createElement('table');
    table.className = 'basket-items-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';
    
    // Add table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr style="background-color: #f2f2f2;">
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Food Item</th>
        <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Quantity</th>
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Expiration Date</th>
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Location</th>
      </tr>
    `;
    table.appendChild(thead);
    
    // Add table body with basket items
    const tbody = document.createElement('tbody');
    basket.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.expirationDate}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.location}</td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    basketItemsList.appendChild(table);
  }
  
  // Populate pickup locations dropdown with all available fridge locations
  function populatePickupLocations() {
    console.log('Populating pickup locations...');
    
    // Clear existing options
    pickupLocationSelect.innerHTML = '<option value="">Select Location</option>';
    
    // First, add locations from basket items to ensure they're available
    const basketLocations = [...new Set(basket.map(item => item.location))];
    console.log('Basket locations:', basketLocations);
    
    // Add hard-coded locations as a fallback
    const fallbackLocations = [
      'Community Fridge - Camden',
      'Community Fridge - Brixton',
      'Community Fridge - Hackney'
    ];
    
    // Add fallback locations to dropdown
    fallbackLocations.forEach(location => {
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      pickupLocationSelect.appendChild(option);
    });
    
    // Then fetch all available fridge locations from the API
    fetch('/api/fridges')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(fridges => {
        console.log('Available fridges:', fridges);
        
        // Clear existing options if we got data from API
        if (fridges && fridges.length > 0) {
          pickupLocationSelect.innerHTML = '<option value="">Select Location</option>';
          
          // Add fridge locations from API
          fridges.forEach(fridge => {
            if (fridge.location) {
              const option = document.createElement('option');
              option.value = fridge.location;
              option.textContent = fridge.location;
              pickupLocationSelect.appendChild(option);
            }
          });
          
          // If there's only one location or if all basket items are from the same location, select it by default
          if (basketLocations.length === 1) {
            // Find the option with this value
            const option = Array.from(pickupLocationSelect.options).find(opt => opt.value === basketLocations[0]);
            if (option) {
              pickupLocationSelect.value = basketLocations[0];
            }
          }
        }
      })
      .catch(error => {
        console.error('Error fetching fridge locations:', error);
        // Fallback is already handled by adding the hardcoded locations
      });
  }
  
  // Handle form submission
  function handleReservationSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const pickupLocation = pickupLocationSelect.value;
    const pickupDate = document.getElementById('pickupDate').value;
    const contactInfo = document.getElementById('contactInfo').value;
    const additionalNotes = document.getElementById('additionalNotes').value;
    
    // Validate form
    if (!pickupLocation || !pickupDate || !contactInfo) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Get recipient ID from localStorage (set during login)
    const recipientId = localStorage.getItem('userId');
    
    console.log('User ID from localStorage:', recipientId);
    
    if (!recipientId) {
      alert('You must be logged in to make a reservation.');
      window.location.href = '/login';
      return;
    }
    
    // For testing purposes, if the user is not a recipient, use a recipient ID
    const userRole = localStorage.getItem('userRole');
    console.log('User role:', userRole);
    
    let actualRecipientId = recipientId;
    if (userRole !== 'Recipient') {
      console.log('User is not a recipient, using test recipient ID 3 (Dylan Smith)');
      actualRecipientId = '3'; // Use Dylan Smith's ID for testing
    }
    
    // Prepare reservation data
    const reservationData = {
      recipientId: actualRecipientId,
      pickupLocation: pickupLocation,
      pickupDate: pickupDate,
      contactInfo: contactInfo,
      additionalNotes: additionalNotes,
      items: basket.map(item => ({
        foodId: item.id,
        quantity: item.quantity
      }))
    };
    
    // Submit reservation to API
    fetch('/api/reserve-food/basket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit reservation');
      }
      return response.json();
    })
    .then(data => {
      // Clear basket after successful reservation
      localStorage.removeItem('foodBasket');
      
      // Show success message
      alert('Your reservation has been submitted successfully!');
      
      // Redirect to reservations page
      window.location.href = '/reservations';
    })
    .catch(error => {
      console.error('Error submitting reservation:', error);
      alert('Failed to submit reservation. Please try again later.');
    });
  }
  
  // Set minimum date for pickup to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('pickupDate').min = tomorrow.toISOString().split('T')[0];
});
