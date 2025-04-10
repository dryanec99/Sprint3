// Debug script to fix user login issues
console.log('Debug login script loaded');

// Function to clear all stored user data
function clearAllUserData() {
  console.log('Clearing all user data');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  sessionStorage.removeItem('currentUser');
  console.log('All user data cleared');
}

// Function to set user data directly
function setUserData(id, name, role) {
  console.log(`Setting user data: ID=${id}, Name=${name}, Role=${role}`);
  
  // Clear existing data first
  clearAllUserData();
  
  // Set localStorage data
  localStorage.setItem('userId', id);
  localStorage.setItem('userName', name);
  localStorage.setItem('userRole', role);
  
  // Set sessionStorage data
  const userData = {
    id: id,
    username: name,
    type: role.toLowerCase()
  };
  sessionStorage.setItem('currentUser', JSON.stringify(userData));
  
  console.log('User data set successfully');
  console.log('localStorage:', {
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('userName'),
    userRole: localStorage.getItem('userRole')
  });
  console.log('sessionStorage:', JSON.parse(sessionStorage.getItem('currentUser')));
}

// Set Ray Johnson's data (Donor)
function setRayJohnson() {
  setUserData('1', 'Ray Johnson', 'Donor');
}

// Set Stacy Brown's data (Volunteer)
function setStacyBrown() {
  setUserData('2', 'Stacy Brown', 'Volunteer');
}

// Set Dylan Smith's data (Recipient)
function setDylanSmith() {
  setUserData('3', 'Dylan Smith', 'Recipient');
}

// Add debug controls to the page
document.addEventListener('DOMContentLoaded', function() {
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.style.position = 'fixed';
  debugPanel.style.bottom = '10px';
  debugPanel.style.left = '10px';
  debugPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  debugPanel.style.color = 'white';
  debugPanel.style.padding = '10px';
  debugPanel.style.borderRadius = '5px';
  debugPanel.style.zIndex = '9999';
  debugPanel.style.fontSize = '12px';
  
  // Add buttons
  debugPanel.innerHTML = `
    <div style="margin-bottom: 5px; font-weight: bold;">Debug Login</div>
    <button id="btn-ray" style="margin-right: 5px; padding: 3px 5px;">Set Ray (Donor)</button>
    <button id="btn-stacy" style="margin-right: 5px; padding: 3px 5px;">Set Stacy (Volunteer)</button>
    <button id="btn-dylan" style="margin-right: 5px; padding: 3px 5px;">Set Dylan (Recipient)</button>
    <button id="btn-clear" style="margin-right: 5px; padding: 3px 5px;">Clear Data</button>
    <button id="btn-refresh" style="padding: 3px 5px;">Refresh Page</button>
  `;
  
  // Add to body
  document.body.appendChild(debugPanel);
  
  // Add event listeners
  document.getElementById('btn-ray').addEventListener('click', function() {
    setRayJohnson();
    alert('Set to Ray Johnson (Donor). Click Refresh to update the page.');
  });
  
  document.getElementById('btn-stacy').addEventListener('click', function() {
    setStacyBrown();
    alert('Set to Stacy Brown (Volunteer). Click Refresh to update the page.');
  });
  
  document.getElementById('btn-dylan').addEventListener('click', function() {
    setDylanSmith();
    alert('Set to Dylan Smith (Recipient). Click Refresh to update the page.');
  });
  
  document.getElementById('btn-clear').addEventListener('click', function() {
    clearAllUserData();
    alert('All user data cleared. Click Refresh to update the page.');
  });
  
  document.getElementById('btn-refresh').addEventListener('click', function() {
    window.location.reload();
  });
  
  // Log current user data
  console.log('Current localStorage:', {
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('userName'),
    userRole: localStorage.getItem('userRole')
  });
  
  const currentUser = sessionStorage.getItem('currentUser');
  console.log('Current sessionStorage:', currentUser ? JSON.parse(currentUser) : null);
});
