require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const Hospital = require("./models/Hospital");
const User = require("./models/User");

const seed = async () => {
    try {
        await connectDB();

        const hospital = await Hospital.findOneAndUpdate(
            { code: "AI-PROF-001" },
            {
                name: "AI.Prof Demo Hospital",
                code: "AI-PROF-001",
                contactEmail: "admin@aiprofdemo.com",
                contactPhone: "9999999999",
                timezone: "Asia/Kolkata",
                callingHours: {
                    start: "09:00",
                    end: "18:00"
                },
                outboundCapacity: 5,
                status: "READY"
            },
            {
                new: true,
                upsert: true
            }
        );

        const hashedPassword = await bcrypt.hash(
            "Admin@12345",
            10
        );

        await User.findOneAndUpdate(
            { email: "admin@aiprofdemo.com" },
            {
                name: "Demo Hospital Admin",
                email: "admin@aiprofdemo.com",
                password: hashedPassword,
                role: "HOSPITAL_ADMIN",
                hospitalId: hospital._id,
                isActive: true
            },
            {
                new: true,
                upsert: true
            }
        );

        console.log("Demo hospital and admin created successfully");

        process.exit(0);

    } catch (error) {
        console.error("Seed error:", error.message);
        process.exit(1);
    }
};

seed();