// Community Fridge Inventory Management System

// Store inventory items in local storage
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [
  {
    id: 1,
    name: 'Fresh Apples',
    category: 'Fruits',
    quantity: '50 kg',
    expiration: '2025-03-15'
  },
  {
    id: 2,
    name: 'Organic Carrots',
    category: 'Vegetables',
    quantity: '30 kg',
    expiration: '2025-03-20'
  },
  {
    id: 3,
    name: 'Canned Beans',
    category: 'Canned Goods',
    quantity: '100 cans',
    expiration: '2026-01-10'
  }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayInventory();
  setupFormSubmission();
  setupEditDeleteHandlers();
});

// Display inventory items in the table
function displayInventory() {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';
  
  inventoryItems.forEach(item => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', item.id);
    
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${item.expiration}</td>
      <td class="action-buttons">
        <button class="edit-btn" data-id="${item.id}">Edit</button>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Save to local storage
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
}

// Setup form submission for adding new items
function setupFormSubmission() {
  const form = document.querySelector('form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const quantity = document.getElementById('quantity').value + (category === 'Canned Goods' ? ' cans' : ' kg');
    const expiration = document.getElementById('expiration').value;
    
    // Create new item object
    const newItem = {
      id: Date.now(), // Use timestamp as unique ID
      name,
      category,
      quantity,
      expiration
    };
    
    // Add to inventory array
    inventoryItems.push(newItem);
    
    // Update display
    displayInventory();
    
    // Reset form
    form.reset();
    
    // Show success message
    alert('Item added successfully!');
  });
}

// Setup edit and delete functionality
function setupEditDeleteHandlers() {
  document.querySelector('table').addEventListener('click', function(event) {
    const target = event.target;
    const itemId = parseInt(target.getAttribute('data-id'));
    
    if (target.classList.contains('delete-btn')) {
      deleteItem(itemId);
    }
    
    if (target.classList.contains('edit-btn')) {
      editItem(itemId);
    }
  });
}

// Delete an item
function deleteItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    inventoryItems = inventoryItems.filter(item => item.id !== id);
    displayInventory();
  }
}

// Edit an item
function editItem(id) {
  const item = inventoryItems.find(item => item.id === id);
  
  if (!item) return;
  
  // Populate form with item data for editing
  document.getElementById('itemName').value = item.name;
  document.getElementById('category').value = item.category;
  
  // Extract numeric quantity
  const quantityMatch = item.quantity.match(/(\d+)/);
  document.getElementById('quantity').value = quantityMatch ? quantityMatch[0] : '';
  
  document.getElementById('expiration').value = item.expiration;
  
  // Change form submit button text
  const submitButton = document.querySelector('form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Update Item';
  
  // Create a function to handle the update
  const updateHandler = function(event) {
    event.preventDefault();
    
    // Update item with new values
    item.name = document.getElementById('itemName').value;
    item.category = document.getElementById('category').value;
    item.quantity = document.getElementById('quantity').value + (item.category === 'Canned Goods' ? ' cans' : ' kg');
    item.expiration = document.getElementById('expiration').value;
    
    // Update display
    displayInventory();
    
    // Reset form and button text
    document.querySelector('form').reset();
    submitButton.textContent = originalText;
    
    // Remove this event listener
    document.querySelector('form').removeEventListener('submit', updateHandler);
    
    // Restore normal form submission
    setupFormSubmission();
    
    // Show success message
    alert('Item updated successfully!');
  };
  
  // Remove regular submission handler temporarily
  document.querySelector('form').removeEventListener('submit', setupFormSubmission);
  
  // Add update handler
  document.querySelector('form').addEventListener('submit', updateHandler);
} 