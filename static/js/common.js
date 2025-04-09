// Community Fridge Common JavaScript Functionality

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  checkAuthentication();
  setupNavigationHighlight();
  displayNotificationCount();
  makeLogoClickable();
});

// Make the Community Fridge logo/title clickable on all pages
function makeLogoClickable() {
  const headerTitle = document.querySelector('header h1');
  if (headerTitle) {
    // Create a wrapper link if it doesn't already exist
    if (!headerTitle.querySelector('a')) {
      const titleText = headerTitle.textContent;
      headerTitle.innerHTML = `<a href="/" style="color: white; text-decoration: none;">${titleText}</a>`;
      console.log('Made Community Fridge logo clickable');
    }
  }
}

// Check if user is authenticated and redirect if needed
function checkAuthentication() {
  // Get current page path
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop();
  
  // Pages that require authentication
  const securedPages = [
    'donor.html',
    'recepient.html',
    'volunteer.html', 
    'donationform.html',
    'donationhistory.html',
    'manageinventory.html',
    'managereservations.html',
    'reservations.html',
    'reservefood.html',
    'sendnotifications.html'
  ];
  
  // Pages accessible to specific user types
  const roleSpecificPages = {
    'donor.html': ['donor'],
    'recepient.html': ['recipient'],
    'volunteer.html': ['volunteer'],
    'donationform.html': ['donor'],
    'donationhistory.html': ['donor'],
    'manageinventory.html': ['volunteer'],
    'managereservations.html': ['volunteer'],
    'reservations.html': ['recipient'],
    'reservefood.html': ['recipient'],
    'sendnotifications.html': ['volunteer']
  };
  
  // Public pages that don't require authentication
  const publicPages = [
    'index.html',
    'login.html',
    'main.html',
    'about.html',
    'viewfood.html',
    'contact.html',
    'donationguidelines.html'
  ];
  
  // Check if current page requires authentication
  if (securedPages.includes(pageName)) {
    // Get current user from session storage
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
      // Not logged in, redirect to login page
      alert('Please log in to access this page.');
      window.location.href = 'login.html';
      return;
    }
    
    // Check if user has appropriate role for this page
    const user = JSON.parse(currentUser);
    const allowedRoles = roleSpecificPages[pageName] || [];
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
      // User doesn't have the right role, redirect to appropriate page
      alert('You do not have permission to access this page.');
      
      // Redirect based on user type
      switch (user.type) {
        case 'donor':
          window.location.href = 'donor.html';
          break;
        case 'recipient':
          window.location.href = 'recepient.html';
          break;
        case 'volunteer':
          window.location.href = 'volunteer.html';
          break;
        default:
          window.location.href = 'main.html';
      }
      return;
    }
  }
}

// Highlight current page in navigation menu
function setupNavigationHighlight() {
  // Get current page path
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop();
  
  // Find all navigation links
  const navLinks = document.querySelectorAll('nav a');
  
  // Highlight the current page
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    }
  });
}

// Display notification count for current user
function displayNotificationCount() {
  // Check if notification count element exists
  const notificationCounter = document.getElementById('notificationCount');
  
  if (notificationCounter) {
    // Get notifications for current user
    const userNotifications = getUserNotifications();
    
    // Count unread notifications
    const unreadCount = userNotifications.filter(notification => {
      return !notification.read.includes(getCurrentUserId());
    }).length;
    
    // Update notification counter
    if (unreadCount > 0) {
      notificationCounter.textContent = unreadCount;
      notificationCounter.style.display = 'inline-block';
    } else {
      notificationCounter.style.display = 'none';
    }
  }
}

// Get current user ID
function getCurrentUserId() {
  const currentUser = sessionStorage.getItem('currentUser');
  
  if (currentUser) {
    const user = JSON.parse(currentUser);
    return user.id || user.username;
  }
  
  return null;
}

// Get notifications for current user (reference to function in notifications.js)
function getUserNotifications() {
  // If notifications.js is loaded, use its function
  if (typeof window.getUserNotifications === 'function') {
    return window.getUserNotifications();
  }
  
  // Fallback implementation if notifications.js is not loaded
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  
  // Get current user
  const currentUser = sessionStorage.getItem('currentUser');
  
  if (!currentUser) {
    return [];
  }
  
  const user = JSON.parse(currentUser);
  
  // Filter notifications for this user based on audience
  return notifications.filter(notification => {
    return notification.audience === 'all' || 
           (notification.audience === 'donors' && user.type === 'donor') ||
           (notification.audience === 'recipients' && user.type === 'recipient') ||
           (notification.audience === 'volunteers' && user.type === 'volunteer');
  });
}

// Logout function
function logout() {
  // Clear session storage
  sessionStorage.removeItem('currentUser');
  
  // Redirect to login page
  window.location.href = 'login.html';
} 