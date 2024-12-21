document.getElementById('extractButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('facebook.com')) {
    document.getElementById('status').textContent = 'Please navigate to a Facebook post';
    return;
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractImages,
    });

    const images = results[0].result;
    displayImages(images);
  } catch (error) {
    document.getElementById('status').textContent = 'Error extracting images: ' + error.message;
  }
});

function displayImages(images) {
  const container = document.getElementById('imageContainer');
  container.innerHTML = '';
  
  if (images.length === 0) {
    document.getElementById('status').textContent = 'No images found';
    return;
  }

  images.forEach(imageUrl => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'extracted-image';
    img.addEventListener('click', () => {
      window.open(imageUrl, '_blank');
    });
    container.appendChild(img);
  });

  document.getElementById('status').textContent = `Found ${images.length} images`;
}

function extractImages() {
  const images = [];
  
  // Find all images in the post
  document.querySelectorAll('img').forEach(img => {
    // Filter out small icons and emoji
    if (img.width >= 100 && img.height >= 100) {
      const src = img.src;
      if (src && !images.includes(src)) {
        images.push(src);
      }
    }
  });

  return images;
} 