const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
    try {
        console.log("mongo_uri: ", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connection to MongoDB: ", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
