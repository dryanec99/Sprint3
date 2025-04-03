// Community Fridge Contact Form Functionality

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  setupContactForm();
});

// Setup contact form submission
function setupContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form values
      const name = contactForm.querySelector('input[name="name"]').value.trim();
      const email = contactForm.querySelector('input[name="email"]').value.trim();
      const subject = contactForm.querySelector('input[name="subject"]').value.trim();
      const message = contactForm.querySelector('textarea[name="message"]').value.trim();
      
      // Basic validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }
      
      // Email validation
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      // Create message object
      const contactMessage = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toISOString(),
        read: false
      };
      
      // Store message in local storage
      saveContactMessage(contactMessage);
      
      // Show success message
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      contactForm.reset();
    });
  }
}

// Check if email is valid
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Save contact message to local storage
function saveContactMessage(message) {
  // Get existing messages
  const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
  
  // Add new message
  messages.push(message);
  
  // Save to local storage
  localStorage.setItem('contactMessages', JSON.stringify(messages));
} 