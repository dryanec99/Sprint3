// Community Fridge Login System

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  setupTabSwitching();
  setupUserTypeChange();
  setupLoginForm();
  setupSignupForm();
});

// Setup tab switching functionality
function setupTabSwitching() {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const volunteerForm = document.getElementById("volunteerForm");

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    if (volunteerForm) {
      volunteerForm.style.display = "none";  // Hide volunteer form when login tab is active
    }
  });

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    
    // Handle volunteer form visibility based on current selection
    const userType = document.getElementById("userType");
    if (userType && userType.value === "volunteer" && volunteerForm) {
      volunteerForm.style.display = "block";
    } else if (volunteerForm) {
      volunteerForm.style.display = "none";
    }
  });
}

// Show/hide volunteer form based on user type selection
function setupUserTypeChange() {
  const userType = document.getElementById("userType");
  const signupDetails = document.getElementById("signupDetails");
  const volunteerForm = document.getElementById("volunteerForm");
  
  if (userType && signupDetails && volunteerForm) {
    userType.addEventListener("change", () => {
      if (userType.value === "volunteer") {
        volunteerForm.style.display = "block"; // Show the volunteer form
      } else {
        volunteerForm.style.display = "none"; // Hide the volunteer form
      }
    });
  }
}

// Handle login form submission
function setupLoginForm() {
  const loginForm = document.getElementById("loginForm");
  
  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const username = loginForm.querySelector('input[name="username"]').value;
      const password = loginForm.querySelector('input[name="password"]').value;
      
      // Get registered users from local storage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find user with matching credentials
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        // Store logged in user in session storage
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Also store in localStorage for messaging system
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name || username);
        localStorage.setItem('userRole', user.type);
        
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
      } else {
        alert('Invalid username or password. Please try again.');
      }
    });
  }
}

// Handle signup form submission
function setupSignupForm() {
  const signupForm = document.getElementById("signupForm");
  
  if (signupForm) {
    signupForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const userType = document.getElementById("userType").value;
      
      if (!userType) {
        alert('Please select a user type.');
        return;
      }
      
      // Get form data based on user type
      let userData = {
        type: userType,
        email: signupForm.querySelector('input[name="email"]').value,
        username: signupForm.querySelector('input[name="newUsername"]').value,
        password: signupForm.querySelector('input[name="newPassword"]').value
      };
      
      // Password validation
      if (userData.password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      
      // Add volunteer specific data if applicable
      if (userType === 'volunteer') {
        userData.fullName = signupForm.querySelector('input[name="fullName"]').value;
        userData.whyVolunteer = signupForm.querySelector('textarea[name="whyVolunteer"]').value;
        userData.availability = signupForm.querySelector('input[name="availability"]').value;
        userData.skills = signupForm.querySelector('textarea[name="skills"]').value;
        userData.status = 'Pending Approval';
      }
      
      // Get existing users
      let users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if username already exists
      if (users.some(user => user.username === userData.username)) {
        alert('Username already exists. Please choose another one.');
        return;
      }
      
      // Add the new user
      users.push(userData);
      
      // Save to local storage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Store logged in user in session storage
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      
      alert('Registration successful!');
      
      // Redirect based on user type
      switch (userType) {
        case 'donor':
          window.location.href = 'donor.html';
          break;
        case 'recipient':
          window.location.href = 'recepient.html';
          break;
        case 'volunteer':
          alert('Your volunteer application has been submitted and is pending approval.');
          window.location.href = 'main.html';
          break;
        default:
          window.location.href = 'main.html';
      }
    });
  }
} 