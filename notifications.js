// Community Fridge Notification System

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  setupNotificationForm();
});

// Setup notification form submission
function setupNotificationForm() {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form values
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const audience = document.getElementById('audience').value;
      
      // Basic client-side validation
      if (!subject || !message || !audience) {
        alert('Please fill in all fields.');
        return;
      }
      
      // Create notification object
      const notification = {
        id: Date.now(),
        subject,
        message,
        audience,
        sender: getCurrentUser(),
        timestamp: new Date().toISOString(),
        read: []
      };
      
      // Store notification in local storage
      saveNotification(notification);
      
      // Show success message
      alert('Notification sent successfully!');
      
      // Reset form
      form.reset();
    });
  }
}

// Get current logged in user
function getCurrentUser() {
  // Get from session storage if available
  const currentUser = sessionStorage.getItem('currentUser');
  
  if (currentUser) {
    const user = JSON.parse(currentUser);
    return user.username || 'System';
  }
  
  return 'System'; // Default sender if no user is logged in
}

// Save notification to local storage
function saveNotification(notification) {
  // Get existing notifications
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  
  // Add new notification
  notifications.push(notification);
  
  // Save to local storage
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Send to target audience
  sendToTargetAudience(notification);
}

// Send notification to target audience
function sendToTargetAudience(notification) {
  // Get all users
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Filter users based on audience
  let targetUsers = [];
  
  switch (notification.audience) {
    case 'all':
      targetUsers = users;
      break;
    case 'donors':
      targetUsers = users.filter(user => user.type === 'donor');
      break;
    case 'recipients':
      targetUsers = users.filter(user => user.type === 'recipient');
      break;
    case 'volunteers':
      targetUsers = users.filter(user => user.type === 'volunteer');
      break;
  }
  
  // In a real application, this would send emails or push notifications
  // For this demo, we'll just log to console
  console.log(`Notification '${notification.subject}' sent to ${targetUsers.length} users`);
  
  // For demo, also show popup
  if (targetUsers.length > 0) {
    const targetList = targetUsers.map(user => user.username).join(', ');
    console.log(`Notification would be sent to: ${targetList}`);
  } else {
    console.log('No users match the selected audience');
  }
}

// Get notifications for the current user
function getUserNotifications() {
  // Get all notifications
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