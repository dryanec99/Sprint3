document.querySelector('form').addEventListener('submit', function(event) {
  if (!validateForm()) {
    event.preventDefault(); // Prevent form submission if validation fails
  }
});