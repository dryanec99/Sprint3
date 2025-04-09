// Community Fridge Inventory Management System

// Store fridges data
const fridges = [
  {
    id: 1,
    location: 'Community Fridge - Camden',
    capacity: 100,
    currentStock: 20,
    items: []
  },
  {
    id: 2,
    location: 'Community Fridge - Brixton',
    capacity: 80,
    currentStock: 15,
    items: []
  },
  {
    id: 3,
    location: 'Community Fridge - Hackney',
    capacity: 120,
    currentStock: 30,
    items: []
  }
];

// Store inventory items
let inventoryItems = [
  {
    id: 1,
    name: 'Fresh Apples',
    category: 'Fruits',
    quantity: 10,
    expiration: '2025-04-10',
    status: 'Available',
    fridgeId: 1,
    fridgeLocation: 'Community Fridge - Camden'
  },
  {
    id: 2,
    name: 'Organic Milk',
    category: 'Dairy',
    quantity: 3,
    expiration: '2025-03-28',
    status: 'Available',
    fridgeId: 2,
    fridgeLocation: 'Community Fridge - Brixton'
  },
  {
    id: 3,
    name: 'Brown Rice',
    category: 'Grains',
    quantity: 20,
    expiration: '2025-06-15',
    status: 'Available',
    fridgeId: 3,
    fridgeLocation: 'Community Fridge - Hackney'
  },
  {
    id: 4,
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 8,
    expiration: '2025-04-05',
    status: 'Available',
    fridgeId: 1,
    fridgeLocation: 'Community Fridge - Camden'
  },
  {
    id: 5,
    name: 'Canned Beans',
    category: 'Canned Goods',
    quantity: 12,
    expiration: '2026-01-01',
    status: 'Available',
    fridgeId: 2,
    fridgeLocation: 'Community Fridge - Brixton'
  }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load data from API or localStorage
  loadData();
  
  // Initialize tabs
  setupTabs();
  
  // Display fridges and inventory
  displayFridges();
  displayInventory();
  
  // Setup form submission for adding new items
  setupFormSubmission();
  
  // Setup event handlers
  setupEventHandlers();
  
  // Populate fridge dropdowns
  populateFridgeDropdowns();
});

// Load data from API or localStorage
function loadData() {
  // Try to load from localStorage first
  const savedInventory = localStorage.getItem('inventoryItems');
  if (savedInventory) {
    inventoryItems = JSON.parse(savedInventory);
  }
  
  // Group items by fridge
  groupItemsByFridge();
}

// Group inventory items by fridge
function groupItemsByFridge() {
  // Reset fridge items
  fridges.forEach(fridge => {
    fridge.items = [];
    fridge.currentStock = 0;
  });
  
  // Group items by fridge
  inventoryItems.forEach(item => {
    const fridge = fridges.find(f => f.id === item.fridgeId);
    if (fridge) {
      fridge.items.push(item);
      fridge.currentStock += item.quantity;
    }
  });
}

// Setup tab functionality
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show corresponding content
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

// Display fridges in cards
function displayFridges() {
  const fridgeContainer = document.getElementById('fridge-cards');
  fridgeContainer.innerHTML = '';
  
  fridges.forEach(fridge => {
    const fridgeCard = document.createElement('div');
    fridgeCard.className = 'fridge-card';
    
    // Calculate usage percentage
    const usagePercentage = Math.round((fridge.currentStock / fridge.capacity) * 100);
    
    // Create fridge card content
    fridgeCard.innerHTML = `
      <div class="fridge-header">
        <div class="fridge-title">${fridge.location}</div>
        <div class="fridge-id">ID: ${fridge.id}</div>
      </div>
      <div class="fridge-stats">
        <div class="fridge-stat">
          <div class="fridge-stat-value">${fridge.currentStock}</div>
          <div class="fridge-stat-label">Current Stock</div>
        </div>
        <div class="fridge-stat">
          <div class="fridge-stat-value">${fridge.capacity}</div>
          <div class="fridge-stat-label">Capacity</div>
        </div>
        <div class="fridge-stat">
          <div class="fridge-stat-value">${usagePercentage}%</div>
          <div class="fridge-stat-label">Usage</div>
        </div>
      </div>
      <h4>Items in this Fridge</h4>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${fridge.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${formatDate(item.expiration)}</td>
              <td class="action-buttons">
                <button class="move-btn" data-id="${item.id}">Move</button>
              </td>
            </tr>
          `).join('')}
          ${fridge.items.length === 0 ? '<tr><td colspan="4" style="text-align: center;">No items in this fridge</td></tr>' : ''}
        </tbody>
      </table>
    `;
    
    fridgeContainer.appendChild(fridgeCard);
  });
}

// Display inventory items in the table
function displayInventory() {
  const tableBody = document.getElementById('inventory-table-body');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  if (inventoryItems.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No inventory items found</td></tr>';
    return;
  }
  
  inventoryItems.forEach(item => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', item.id);
    
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${formatDate(item.expiration)}</td>
      <td>${item.status}</td>
      <td>${item.fridgeLocation}</td>
      <td class="action-buttons">
        <button class="edit-btn" data-id="${item.id}">Edit</button>
        <button class="move-btn" data-id="${item.id}">Move</button>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Save to local storage
  saveData();
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString();
}

// Setup form submission for adding new items
function setupFormSubmission() {
  const form = document.getElementById('inventoryForm');
  if (!form) return;
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const expiration = document.getElementById('expiration').value;
    const fridgeId = parseInt(document.getElementById('fridgeID').value);
    
    // Find fridge location
    const fridge = fridges.find(f => f.id === fridgeId);
    if (!fridge) {
      alert('Please select a valid fridge location');
      return;
    }
    
    // Create new item object
    const newItem = {
      id: Date.now(), // Use timestamp as unique ID
      name,
      category,
      quantity,
      expiration,
      status: 'Available',
      fridgeId,
      fridgeLocation: fridge.location
    };
    
    // Add to inventory array
    inventoryItems.push(newItem);
    
    // Update fridge stock
    fridge.currentStock += quantity;
    fridge.items.push(newItem);
    
    // Update display
    displayFridges();
    displayInventory();
    
    // Reset form
    form.reset();
    
    // Show success message
    alert('Item added successfully!');
    
    // Switch to inventory tab
    document.querySelector('.tab[data-tab="all-inventory"]').click();
  });
}

// Setup event handlers for buttons
function setupEventHandlers() {
  // Setup edit, delete, and move buttons
  document.addEventListener('click', function(event) {
    // Edit button
    if (event.target.classList.contains('edit-btn')) {
      const itemId = parseInt(event.target.getAttribute('data-id'));
      editItem(itemId);
    }
    
    // Delete button
    if (event.target.classList.contains('delete-btn')) {
      const itemId = parseInt(event.target.getAttribute('data-id'));
      deleteItem(itemId);
    }
    
    // Move button
    if (event.target.classList.contains('move-btn')) {
      const itemId = parseInt(event.target.getAttribute('data-id'));
      openMoveModal(itemId);
    }
  });
  
  // Setup move modal
  setupMoveModal();
}

// Delete an item
function deleteItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    // Find the item
    const item = inventoryItems.find(item => item.id === id);
    if (!item) return;
    
    // Find the fridge
    const fridge = fridges.find(f => f.id === item.fridgeId);
    if (fridge) {
      // Update fridge stock
      fridge.currentStock -= item.quantity;
      // Remove item from fridge items
      fridge.items = fridge.items.filter(i => i.id !== id);
    }
    
    // Remove from inventory array
    inventoryItems = inventoryItems.filter(item => item.id !== id);
    
    // Update display
    displayFridges();
    displayInventory();
  }
}

// Edit an item
function editItem(id) {
  const item = inventoryItems.find(item => item.id === id);
  if (!item) return;
  
  // Switch to add item tab
  document.querySelector('.tab[data-tab="add-item"]').click();
  
  // Populate form with item data for editing
  document.getElementById('itemName').value = item.name;
  document.getElementById('category').value = item.category;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('expiration').value = formatDateForInput(item.expiration);
  document.getElementById('fridgeID').value = item.fridgeId;
  
  // Change form submit button text
  const submitButton = document.querySelector('#inventoryForm button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Update Item';
  
  // Store original fridge and quantity for later
  const originalFridgeId = item.fridgeId;
  const originalQuantity = item.quantity;
  
  // Create a function to handle the update
  const updateHandler = function(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const expiration = document.getElementById('expiration').value;
    const fridgeId = parseInt(document.getElementById('fridgeID').value);
    
    // Find new fridge location
    const fridge = fridges.find(f => f.id === fridgeId);
    if (!fridge) {
      alert('Please select a valid fridge location');
      return;
    }
    
    // If fridge changed, update both fridges
    if (originalFridgeId !== fridgeId) {
      // Update old fridge
      const oldFridge = fridges.find(f => f.id === originalFridgeId);
      if (oldFridge) {
        oldFridge.currentStock -= originalQuantity;
        oldFridge.items = oldFridge.items.filter(i => i.id !== id);
      }
      
      // Update new fridge
      fridge.currentStock += quantity;
      
      // Update item in new fridge's items
      const newItemForFridge = { ...item, name, category, quantity, expiration, fridgeId, fridgeLocation: fridge.location };
      fridge.items.push(newItemForFridge);
    } else {
      // Update same fridge stock (adjust for quantity change)
      fridge.currentStock = fridge.currentStock - originalQuantity + quantity;
      
      // Update item in fridge's items
      const itemIndex = fridge.items.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        fridge.items[itemIndex] = { ...item, name, category, quantity, expiration };
      }
    }
    
    // Update item with new values
    item.name = name;
    item.category = category;
    item.quantity = quantity;
    item.expiration = expiration;
    item.fridgeId = fridgeId;
    item.fridgeLocation = fridge.location;
    
    // Update display
    displayFridges();
    displayInventory();
    
    // Reset form and button text
    document.getElementById('inventoryForm').reset();
    submitButton.textContent = originalText;
    
    // Remove this event listener
    document.getElementById('inventoryForm').removeEventListener('submit', updateHandler);
    
    // Restore normal form submission
    setupFormSubmission();
    
    // Show success message
    alert('Item updated successfully!');
    
    // Switch to inventory tab
    document.querySelector('.tab[data-tab="all-inventory"]').click();
  };
  
  // Remove regular submission handler temporarily
  document.getElementById('inventoryForm').removeEventListener('submit', setupFormSubmission);
  
  // Add update handler
  document.getElementById('inventoryForm').addEventListener('submit', updateHandler);
}

// Format date for input field (YYYY-MM-DD)
function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toISOString().split('T')[0];
}

// Populate fridge dropdowns
function populateFridgeDropdowns() {
  const fridgeDropdowns = document.querySelectorAll('#fridgeID, #moveToFridge');
  
  fridgeDropdowns.forEach(dropdown => {
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }
    
    // Add fridge options
    fridges.forEach(fridge => {
      const option = document.createElement('option');
      option.value = fridge.id;
      option.textContent = fridge.location;
      dropdown.appendChild(option);
    });
  });
}

// Setup move modal functionality
function setupMoveModal() {
  const modal = document.getElementById('moveItemModal');
  const closeBtn = modal.querySelector('.close-modal');
  const cancelBtn = document.getElementById('cancelMove');
  const moveForm = document.getElementById('moveItemForm');
  
  // Close modal when clicking X or Cancel
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Handle form submission
  moveForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values
    const itemId = parseInt(document.getElementById('moveItemId').value);
    const toFridgeId = parseInt(document.getElementById('moveToFridge').value);
    const moveQuantity = parseInt(document.getElementById('moveQuantity').value);
    
    // Find the item
    const item = inventoryItems.find(item => item.id === itemId);
    if (!item) {
      alert('Item not found');
      closeModal();
      return;
    }
    
    // Validate quantity
    if (moveQuantity <= 0 || moveQuantity > item.quantity) {
      alert('Please enter a valid quantity');
      return;
    }
    
    // Find source and destination fridges
    const fromFridge = fridges.find(f => f.id === item.fridgeId);
    const toFridge = fridges.find(f => f.id === toFridgeId);
    
    if (!fromFridge || !toFridge) {
      alert('Fridge not found');
      closeModal();
      return;
    }
    
    // If moving all items, simply update the fridge
    if (moveQuantity === item.quantity) {
      // Update source fridge
      fromFridge.currentStock -= item.quantity;
      fromFridge.items = fromFridge.items.filter(i => i.id !== itemId);
      
      // Update destination fridge
      toFridge.currentStock += item.quantity;
      
      // Update item
      item.fridgeId = toFridgeId;
      item.fridgeLocation = toFridge.location;
      
      // Add to destination fridge items
      toFridge.items.push(item);
    } else {
      // Moving partial quantity - create a new item
      const newItem = {
        id: Date.now(), // Use timestamp as unique ID
        name: item.name,
        category: item.category,
        quantity: moveQuantity,
        expiration: item.expiration,
        status: item.status,
        fridgeId: toFridgeId,
        fridgeLocation: toFridge.location
      };
      
      // Update source item and fridge
      item.quantity -= moveQuantity;
      fromFridge.currentStock -= moveQuantity;
      
      // Update destination fridge
      toFridge.currentStock += moveQuantity;
      toFridge.items.push(newItem);
      
      // Add new item to inventory
      inventoryItems.push(newItem);
    }
    
    // Update display
    displayFridges();
    displayInventory();
    
    // Close modal and show success message
    closeModal();
    alert(`Successfully moved ${moveQuantity} ${item.name} to ${toFridge.location}`);
  });
}

// Open move modal for an item
function openMoveModal(itemId) {
  const modal = document.getElementById('moveItemModal');
  const item = inventoryItems.find(item => item.id === itemId);
  
  if (!item) {
    alert('Item not found');
    return;
  }
  
  // Find current fridge
  const currentFridge = fridges.find(f => f.id === item.fridgeId);
  if (!currentFridge) {
    alert('Current fridge not found');
    return;
  }
  
  // Set modal values
  document.getElementById('moveItemId').value = itemId;
  document.getElementById('move-item-name').textContent = `Item: ${item.name} (${item.category})`;
  document.getElementById('moveFromFridge').value = currentFridge.location;
  document.getElementById('moveQuantity').value = item.quantity;
  document.getElementById('moveQuantity').max = item.quantity;
  document.getElementById('maxQuantity').textContent = `Maximum available: ${item.quantity}`;
  
  // Clear and populate destination fridge dropdown (excluding current fridge)
  const toFridgeDropdown = document.getElementById('moveToFridge');
  toFridgeDropdown.innerHTML = '<option value="">Select Destination Fridge</option>';
  
  fridges.forEach(fridge => {
    if (fridge.id !== item.fridgeId) {
      const option = document.createElement('option');
      option.value = fridge.id;
      option.textContent = fridge.location;
      toFridgeDropdown.appendChild(option);
    }
  });
  
  // Show modal
  modal.style.display = 'block';
}

// Close move modal
function closeModal() {
  const modal = document.getElementById('moveItemModal');
  modal.style.display = 'none';
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
}