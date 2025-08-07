const mongoose = require('mongoose');
const { Faker, en } = require('@faker-js/faker');
const connectDB = require('./backend/config/database/mongoose');
const User = require('./backend/models/User');
const Listing = require('./backend/models/Listing');
const { mongoUri } = require('./backend/config/env');
const  getRandomImage  = require('./backend/scripts/imageLinks');

const faker = new Faker({ locale: [en] });

function getRandomItems(array, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function generateListings(count, hostIds) {
  const amenities = ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Pool', 'TV', 'Washer', 'Dryer'];
  const maharashtraCities = [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Satara', 'Sangli', 'Amravati'
  ];
  const listings = [];
  
  for (let i = 0; i < count; i++) {
    const city = maharashtraCities[Math.floor(Math.random() * maharashtraCities.length)];
    const imageUrl = getRandomImage() || 'https://via.placeholder.com/800x600';

    listings.push({
      title: `${faker.commerce.productAdjective()} ${faker.location.street()} Stay`,
      description: faker.lorem.paragraph(),
      location: `${city}, Maharashtra, India`,
      pricePerNight: parseFloat(faker.commerce.price({ min: 20, max: 500 })),
      images: [imageUrl],
      amenities: getRandomItems(amenities, 2, 5),
      host: hostIds[Math.floor(Math.random() * hostIds.length)],
      createdAt: new Date(),
    });
  }
  return listings;
}

async function seedListings() {
  let connection;
  try {
    connection = await connectDB();
    console.log('Connected to MongoDB');

    // Fetch host IDs
    let hostIds;
    try {
      const hosts = await User.find({ isHost: true }).select('_id');
      hostIds = hosts.map(host => host._id);
      if (hostIds.length === 0) {
        throw new Error('No hosts found in User collection');
      }
      console.log(`Found ${hostIds.length} hosts`);
    } catch (hostErr) {
      throw new Error(`Failed to fetch hosts: ${hostErr.message}`);
    }

    // Clear Listings collection
    try {
      await Listing.deleteMany({});
      console.log('Listings collection cleared');
    } catch (clearErr) {
      throw new Error(`Failed to clear Listings collection: ${clearErr.message}`);
    }

    // Seed Listings
    try {
      console.log('Generating and inserting listings...');
      const listings = await generateListings(5000, hostIds);
      const listingResult = await Listing.insertMany(listings, { ordered: false });
      console.log(`Inserted ${listingResult.length} listings`);
    } catch (listingErr) {
      throw new Error(`Failed to seed listings: ${listingErr.message}`);
    }

  } catch (err) {
    console.error('Error seeding Listings collection:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

seedListings();