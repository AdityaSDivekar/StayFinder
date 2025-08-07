const mongoose = require('mongoose');
const { Faker, en } = require('@faker-js/faker');
const connectDB = require('./backend/config/database/mongoose');
const User = require('./backend/models/User');
const Listing = require('./backend/models/Listing');
const Booking = require('./backend/models/Booking');
const { mongoUri } = require('./backend/config/env');

const faker = new Faker({ locale: [en] });

function generateBookings(count, userIds, listingDocs) {
  const bookings = [];
  for (let i = 0; i < count; i++) {
    const checkInDate = faker.date.between({ from: new Date(), to: new Date('2026-12-31') });
    const nights = Math.floor(Math.random() * 10) + 1;
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + nights);
    const listing = listingDocs[Math.floor(Math.random() * listingDocs.length)];
    const totalPrice = parseFloat((nights * listing.pricePerNight).toFixed(2));

    bookings.push({
      listing: listing._id,
      user: userIds[Math.floor(Math.random() * userIds.length)],
      checkInDate,
      checkOutDate,
      totalPrice,
      createdAt: new Date(),
    });
  }
  return bookings;
}

async function seedBookings() {
  let connection;
  try {
    connection = await connectDB();
    console.log('Connected to MongoDB');

    // Fetch user IDs
    let userIds;
    try {
      const users = await User.find({}).select('_id');
      userIds = users.map(user => user._id);
      if (userIds.length === 0) {
        throw new Error('No users found in User collection');
      }
      console.log(`Found ${userIds.length} users`);
    } catch (userErr) {
      throw new Error(`Failed to fetch users: ${userErr.message}`);
    }

    // Fetch listings
    let listingDocs;
    try {
      listingDocs = await Listing.find({});
      if (listingDocs.length === 0) {
        throw new Error('No listings found in Listing collection');
      }
      console.log(`Found ${listingDocs.length} listings`);
    } catch (listingErr) {
      throw new Error(`Failed to fetch listings: ${listingErr.message}`);
    }

    // Clear Bookings collection
    try {
      await Booking.deleteMany({});
      console.log('Bookings collection cleared');
    } catch (clearErr) {
      throw new Error(`Failed to clear Bookings collection: ${clearErr.message}`);
    }

    // Seed Bookings
    try {
      console.log('Generating and inserting bookings...');
      const bookings = generateBookings(20000, userIds, listingDocs);
      const bookingResult = await Booking.insertMany(bookings, { ordered: false });
      console.log(`Inserted ${bookingResult.length} bookings`);
    } catch (bookingErr) {
      throw new Error(`Failed to seed bookings: ${bookingErr.message}`);
    }

  } catch (err) {
    console.error('Error seeding Bookings collection:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

seedBookings();