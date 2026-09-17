const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const outreachRoutes = require("./routes/outreachRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI.Prof Outreach API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/outreach", outreachRoutes);

module.exports = app;