const Outreach = require("../models/Outreach");

const createOutreach = async ({
    hospitalId,
    patientId,
    campaignId,
    scheduledAt
}) => {
    const outreach = await Outreach.create({
        hospitalId,
        patientId,
        campaignId,
        status: "QUEUED",
        attemptNumber: 1,
        scheduledAt
    });

    return outreach;
};

module.exports = {
    createOutreach
};