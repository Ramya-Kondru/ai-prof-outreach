const express = require("express");
const { login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");  //Is this person authenticated?
const authorize = require("../middleware/roleMiddleware"); //Is this authenticated user a hospital admin?

const router = express.Router();

router.post("/login", login);

router.get("/me", protect, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

router.get(
    "/admin-test",
    protect,
    authorize("HOSPITAL_ADMIN"),
    (req, res) => {
        res.json({
            message: "You have hospital admin permission"
        });
    }
);

module.exports = router;