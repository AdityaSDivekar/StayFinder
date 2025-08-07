const fs = require('fs').promises;

const KEY = 'Xom13KjYslw1wY6XonQmP9fPhFws1VRd41jFcIwIrml3bSJeoUkOPrO1';
const PAGE_SIZE = 80; // Max per request
const TARGET = 500;

async function fetchHotelImages() {
  const links = [];
  for (let page = 1; links.length < TARGET; page++) {
    try {
      console.log(`Fetching page ${page}...`);
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=hotel&per_page=${PAGE_SIZE}&page=${page}`,
        { headers: { Authorization: KEY } }
      );
      if (!res.ok) throw new Error(`API error on page ${page}: ${res.status}`);
      const { photos } = await res.json();
      if (photos.length === 0) {
        console.log('No more photos available');
        break;
      }

      photos.forEach(p => {
        links.push(p.src.large); // Using large size for better quality
      });
      console.log(`Fetched ${photos.length} images, total: ${links.length}`);
    } catch (err) {
      console.error('Error fetching Pexels images:', err.message);
      break;
    }
  }

  // Slice to ensure exactly TARGET number of links
  const finalLinks = links.slice(0, TARGET);
  
  // Save links to links.txt
  try {
    await fs.writeFile('links.txt', finalLinks.join('\n'));
    console.log(`✅ Saved ${finalLinks.length} hotel image URLs to links.txt`);
  } catch (err) {
    console.error('Error saving links to file:', err.message);
  }

  return finalLinks;
}

module.exports = fetchHotelImages;

// Run the function if executed directly
if (require.main === module) {
  fetchHotelImages().catch(err => {
    console.error('Failed to fetch and save images:', err.message);
    process.exit(1);
  });
}