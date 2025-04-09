// Community Fridge Dashboard functionality

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayUserInfo();
  setupLogoutButton();
  updateNavigation();
});

// Display user information on the dashboard
function displayUserInfo() {
  // Get current user from session storage
  const currentUser = sessionStorage.getItem('currentUser');
  
  if (!currentUser) {
    // If no user is logged in, redirect to login page
    window.location.href = 'login.html';
    return;
  }
  
  const user = JSON.parse(currentUser);
  
  // Check if we have a header element to update
  const header = document.querySelector('header');
  
  if (header) {
    // Create or update user info display
    let userInfoDiv = document.getElementById('user-info');
    
    if (!userInfoDiv) {
      // Create user info div if it doesn't exist
      userInfoDiv = document.createElement('div');
      userInfoDiv.id = 'user-info';
      userInfoDiv.style.position = 'absolute';
      userInfoDiv.style.right = '20px';
      userInfoDiv.style.top = '20px';
      userInfoDiv.style.color = 'white';
      userInfoDiv.style.textAlign = 'right';
      header.appendChild(userInfoDiv);
    }
    
    // Update user info
    userInfoDiv.innerHTML = `
      <div>Welcome, <strong>${user.username}</strong> (${user.type})</div>
      <button id="logout-btn" style="background: none; border: none; color: white; text-decoration: underline; cursor: pointer; padding: 5px;">Logout</button>
    `;
  }
  
  // Check current page to display relevant user type information
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop();
  
  // Update page title based on user type
  const pageTitle = document.querySelector('title');
  if (pageTitle) {
    switch (user.type) {
      case 'donor':
        pageTitle.textContent = 'Donor Dashboard - Community Fridge';
        break;
      case 'recipient':
        pageTitle.textContent = 'Recipient Dashboard - Community Fridge';
        break;
      case 'volunteer':
        pageTitle.textContent = 'Volunteer Dashboard - Community Fridge';
        break;
    }
  }
  
  // Update heading based on user type
  const mainHeading = document.querySelector('section h2');
  if (mainHeading) {
    switch (user.type) {
      case 'donor':
        mainHeading.textContent = 'Donor Dashboard';
        break;
      case 'recipient':
        mainHeading.textContent = 'Food Recipient Dashboard';
        break;
      case 'volunteer':
        mainHeading.textContent = 'Volunteer Dashboard';
        break;
    }
  }
}

// Setup logout button functionality
function setupLogoutButton() {
  // Add event listener after the DOM has been updated
  setTimeout(() => {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        // Clear session storage
        sessionStorage.removeItem('currentUser');
        
        // Redirect to login page
        window.location.href = 'login.html';
      });
    }
  }, 100);
}

// Update navigation links to include user type specific paths
function updateNavigation() {
  // Get all navigation links
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // If link doesn't already have a file extension, add .html
    if (href && !href.startsWith('http') && !href.includes('.html') && href !== '/') {
      link.setAttribute('href', href + '.html');
    }
  });
} 