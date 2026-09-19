const express = require("express");

const {
    createOrUpdateEHR,
    getEHR,
    getAllEHR,
    deleteEHR
} = require("../controllers/ehrController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// GET ALL EHR RECORDS
// ======================================================

router.get(
    "/",
    protect,
    getAllEHR
);


// ======================================================
// GET EHR FOR ONE PATIENT
// ======================================================

router.get(
    "/patient/:patientId",
    protect,
    getEHR
);


// ======================================================
// CREATE OR UPDATE EHR
// ======================================================

router.post(
    "/patient/:patientId",
    protect,
    createOrUpdateEHR
);


// ======================================================
// DELETE EHR
// ======================================================

router.delete(
    "/patient/:patientId",
    protect,
    deleteEHR
);


module.exports = router;