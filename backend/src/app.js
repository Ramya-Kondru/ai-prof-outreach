const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const patientRoutes = require("./routes/patientRoutes");

const campaignRoutes = require("./routes/campaignRoutes");

const outreachRoutes = require("./routes/outreachRoutes");

const queueRoutes = require("./routes/queueRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const adminRoutes = require("./routes/adminRoutes");

const aiRoutes = require("./routes/aiRoutes");
const conversationRoutes =
    require("./routes/conversationRoutes");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {

    res.json({

        message:
            "AI.Prof Outreach API is running"

    });

});


// ======================================================
// API ROUTES
// ======================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/patients",
    patientRoutes
);

app.use(
    "/api/campaigns",
    campaignRoutes
);

app.use(
    "/api/outreach",
    outreachRoutes
);

app.use(
    "/api/queue",
    queueRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);


// ======================================================
// AI ROUTES
// ======================================================

app.use(
    "/api/ai",
    aiRoutes
);
app.use(
    "/api/conversations",
    conversationRoutes
);


module.exports = app;