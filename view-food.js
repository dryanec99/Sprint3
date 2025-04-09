// Community Fridge View Food System

document.addEventListener('DOMContentLoaded', function () {
  displayAvailableFood();
});

// Fetch and display available food items
function displayAvailableFood() {
  fetch('/api/food')
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector('tbody');

        if (!data || data.length === 0) {
          tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center;">No food items are currently available. Please check back later.</td>
          </tr>
        `;
          return;
        }

        // Clear existing table rows
        tbody.innerHTML = '';

        data.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.status}</td>
          <td>${item.quantity}</td>
          <td>${formatDate(item.expirationDate)}</td>
          <td>${item.donor_name || 'Unknown Donor'}</td>
        `;

          // Add row to table
          tbody.appendChild(row);

          // Make row clickable
          row.style.cursor = 'pointer';
          row.addEventListener('click', () => {
            window.location.href = 'reservefood.html';
          });

          // Hover effects
          row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#e8f5e9';
          });
          row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
          });
        });
      })
      .catch(error => {
        console.error('Error fetching food data:', error);
      });
}

// Format date to readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
