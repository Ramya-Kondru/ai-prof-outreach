const express = require("express");

const {
    getHospitals,
    createHospital,
    updateHospitalStatus,
    getMyHospital
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/hospitals",
    protect,
    authorize("PLATFORM_ADMIN"),
    getHospitals
);

router.post(
    "/hospitals",
    protect,
    authorize("PLATFORM_ADMIN"),
    createHospital
);

router.patch(
    "/hospitals/:hospitalId/status",
    protect,
    authorize("PLATFORM_ADMIN"),
    updateHospitalStatus
);

router.get(
    "/my-hospital",
    protect,
    authorize("HOSPITAL_ADMIN"),
    getMyHospital
);
module.exports = router;