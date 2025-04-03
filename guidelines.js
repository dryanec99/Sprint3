// Community Fridge Donation Guidelines Functionality

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  enhanceGuidelines();
  setupFavoriteGuidelines();
});

// Enhance guidelines with expandable details
function enhanceGuidelines() {
  const guidelinesList = document.querySelector('ul');
  
  if (guidelinesList) {
    const listItems = guidelinesList.querySelectorAll('li');
    
    listItems.forEach(item => {
      // Add expandable functionality to each list item
      const content = item.innerHTML;
      const titleMatch = content.match(/<strong>(.*?)<\/strong>/);
      
      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1];
        const details = content.replace(`<strong>${title}</strong>: `, '');
        
        // Create collapsible section
        item.innerHTML = `
          <div class="guideline-header">
            <strong>${title}</strong>
            <span class="expand-icon">+</span>
          </div>
          <div class="guideline-details" style="display: none; padding-left: 20px; margin-top: 5px;">
            ${details}
          </div>
        `;
        
        // Add click event to toggle details
        const header = item.querySelector('.guideline-header');
        const detailsDiv = item.querySelector('.guideline-details');
        const expandIcon = item.querySelector('.expand-icon');
        
        header.style.cursor = 'pointer';
        
        header.addEventListener('click', function() {
          const isVisible = detailsDiv.style.display !== 'none';
          
          detailsDiv.style.display = isVisible ? 'none' : 'block';
          expandIcon.textContent = isVisible ? '+' : '-';
        });
      }
    });
  }
  
  // Add print button
  const mainSection = document.querySelector('main');
  if (mainSection) {
    const printButton = document.createElement('button');
    printButton.textContent = 'Print Guidelines';
    printButton.style.marginTop = '20px';
    printButton.style.padding = '10px 20px';
    printButton.style.backgroundColor = '#2e8b57';
    printButton.style.color = 'white';
    printButton.style.border = 'none';
    printButton.style.borderRadius = '5px';
    printButton.style.cursor = 'pointer';
    
    printButton.addEventListener('click', function() {
      window.print();
    });
    
    mainSection.appendChild(printButton);
  }
}

// Setup favorite guidelines functionality
function setupFavoriteGuidelines() {
  const mainSection = document.querySelector('main');
  
  if (mainSection) {
    // Create favorites section
    const favoritesSection = document.createElement('div');
    favoritesSection.className = 'favorites-section';
    favoritesSection.style.marginTop = '30px';
    favoritesSection.style.padding = '20px';
    favoritesSection.style.backgroundColor = '#f0f0f0';
    favoritesSection.style.borderRadius = '5px';
    
    favoritesSection.innerHTML = `
      <h3>Save Guidelines for Quick Reference</h3>
      <p>Click the "Save" button below to store these guidelines in your browser for future reference.</p>
      <button id="save-guidelines" style="padding: 10px 20px; background-color: #3cb371; color: white; border: none; border-radius: 5px; cursor: pointer;">Save Guidelines</button>
      <div id="saved-status" style="margin-top: 10px;"></div>
    `;
    
    mainSection.appendChild(favoritesSection);
    
    // Add save functionality
    const saveButton = document.getElementById('save-guidelines');
    const savedStatus = document.getElementById('saved-status');
    
    if (saveButton && savedStatus) {
      // Check if guidelines are already saved
      const savedGuidelines = localStorage.getItem('savedGuidelines');
      
      if (savedGuidelines) {
        savedStatus.textContent = 'Guidelines are saved for quick reference.';
        savedStatus.style.color = 'green';
        saveButton.textContent = 'Guidelines Saved';
        saveButton.disabled = true;
      }
      
      saveButton.addEventListener('click', function() {
        // Get the guidelines content
        const guidelinesContent = document.querySelector('ul').innerHTML;
        
        // Save to local storage
        localStorage.setItem('savedGuidelines', guidelinesContent);
        
        // Update status
        savedStatus.textContent = 'Guidelines saved successfully!';
        savedStatus.style.color = 'green';
        
        // Update button
        saveButton.textContent = 'Guidelines Saved';
        saveButton.disabled = true;
      });
    }
  }
} 