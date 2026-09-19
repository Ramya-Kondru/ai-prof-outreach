const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Hospital = require("../models/Hospital");


// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!name || !email || !password || !role) {

            return res.status(400).json({
                message:
                    "Name, email, password and role are required"
            });

        }


        // ==================================================
        // CHECK EXISTING USER
        // ==================================================

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {

            return res.status(409).json({
                message:
                    "User already exists"
            });

        }


        // ==================================================
        // HASH PASSWORD
        // ==================================================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ==================================================
        // HOSPITAL
        // ==================================================

        let hospitalId = null;


        /*
         * PLATFORM_ADMIN is not associated
         * with a particular hospital.
         *
         * All other users in our prototype
         * belong to the demo hospital.
         */

        if (role !== "PLATFORM_ADMIN") {

            const hospital =
                await Hospital.findOne({
                    code: "AI-PROF-001"
                });


            if (!hospital) {

                return res.status(500).json({
                    message:
                        "Demo hospital not found. Please run the seed script."
                });

            }


            hospitalId =
                hospital._id;

        }


        // ==================================================
        // CREATE USER
        // ==================================================

        const user =
            await User.create({

                name,

                email:
                    email.toLowerCase(),

                password:
                    hashedPassword,

                role,

                hospitalId

            });


        // ==================================================
        // CREATE JWT
        // ==================================================

        const token =
            jwt.sign(

                {
                    userId:
                        user._id,

                    role:
                        user.role,

                    hospitalId:
                        user.hospitalId
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }

            );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({

            message:
                "Registration successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

                hospitalId:
                    user.hospitalId

            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({
            message:
                "Server error"
        });

    }
};



// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }


        // ==================================================
        // FIND USER
        // ==================================================

        const user =
            await User.findOne({

                email:
                    email.toLowerCase()

            });


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        // ==================================================
        // ACTIVE CHECK
        // ==================================================

        if (!user.isActive) {

            return res.status(403).json({
                message:
                    "User account is inactive"
            });

        }


        // ==================================================
        // PASSWORD CHECK
        // ==================================================

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatches) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        // ==================================================
        // JWT
        // ==================================================

        const token =
            jwt.sign(

                {
                    userId:
                        user._id,

                    role:
                        user.role,

                    hospitalId:
                        user.hospitalId
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }

            );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

                hospitalId:
                    user.hospitalId

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({
            message:
                "Server error"
        });

    }

};



// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    register,
    login

};