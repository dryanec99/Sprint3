function validateForm() {
  let foodName = document.getElementById('foodName').value;
  let category = document.getElementById('category').value;
  let quantity = document.getElementById('quantity').value;
  let expiration = document.getElementById('expiration').value;
  let description = document.getElementById('description').value;

  // Check if any of the fields are empty
  if (!foodName || !category || !quantity || !expiration) {
    alert('Please fill out all required fields.');
    return false; // Prevent form submission
  }

  // Ensure quantity is a positive number
  if (quantity <= 0) {
    alert('Please enter a valid quantity.');
    return false; // Prevent form submission
  }

  // Optional: Check if the expiration date is valid (in the future)
  let today = new Date();
  let expirationDate = new Date(expiration);
  if (expirationDate < today) {
    alert('Expiration date cannot be in the past.');
    return false; // Prevent form submission
  }

  return true; // Allow form submission
}
