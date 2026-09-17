const Outreach = require("../models/Outreach");
const Campaign = require("../models/Campaign");

const processQueue = async () => {
    const queuedOutreach = await Outreach.find({
        status: "QUEUED"
    })
        .sort({ scheduledAt: 1 })
        .limit(20);

    const processed = [];

    for (const outreach of queuedOutreach) {
        const campaign = await Campaign.findById(
            outreach.campaignId
        );

        if (!campaign) {
            continue;
        }

        const activeCount = await Outreach.countDocuments({
            campaignId: outreach.campaignId,
            status: "IN_PROGRESS"
        });

        if (activeCount >= campaign.outboundCapacity) {
            continue;
        }

        outreach.status = "IN_PROGRESS";
        outreach.startedAt = new Date();

        await outreach.save();

        processed.push(outreach);
    }

    return processed;
};

module.exports = {
    processQueue
};