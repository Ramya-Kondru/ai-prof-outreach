const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); //uses it to connect to Atlas.

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);  //If the database is unavailable, we stop the backend.
    }
};

module.exports = connectDB;