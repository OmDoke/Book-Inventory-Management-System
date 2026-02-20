import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env');
    process.exit(1);
}

async function testConnection() {
    try {
        console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^:@]+)@/, ':***@')}`); // Hide password
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:');
        console.error(error);
        process.exit(1);
    }
}

testConnection();
