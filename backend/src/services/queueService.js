const Outreach = require("../models/Outreach");
const Hospital = require("../models/Hospital");
const { calculatePriority } = require("./queuePriorityService");

// ======================================================
// PROCESS OUTREACH QUEUE
// ======================================================

const processQueue = async (hospitalId) => {
    const now = new Date();

    console.log("\n========================================");
    console.log("PROCESSING OUTREACH QUEUE");
    console.log("Hospital ID:", hospitalId);
    console.log("Current time:", now);
    console.log("========================================\n");

    // ==================================================
    // 1. FIND HOSPITAL
    // ==================================================

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
        console.log("QUEUE STOPPED: Hospital not found");
        return [];
    }

    console.log("HOSPITAL FOUND:", {
        name: hospital.name,
        outboundCapacity: hospital.outboundCapacity
    });

    // ==================================================
    // 2. FIND ELIGIBLE QUEUED OUTREACH
    // ==================================================

    /*
     * Important:
     *
     * We should NOT process every QUEUED record.
     *
     * scheduledAt must be reached.
     *
     * retryAt must also be reached if it exists.
     */

    const queuedOutreach = await Outreach.find({
        hospitalId,

        status: "QUEUED",

        // Outreach should only be processed
        // when its scheduled time has arrived.
        scheduledAt: {
            $lte: now
        },

        // Retry should only happen after retryAt.
        $or: [
            {
                retryAt: {
                    $exists: false
                }
            },
            {
                retryAt: null
            },
            {
                retryAt: {
                    $lte: now
                }
            }
        ]
    })
        .populate("campaignId")
        .populate("patientId");

    console.log(
        "\nELIGIBLE QUEUED OUTREACH COUNT:",
        queuedOutreach.length
    );

    if (queuedOutreach.length === 0) {
        console.log(
            "No eligible queued outreach found."
        );

        return [];
    }

    // ==================================================
    // 3. CALCULATE PRIORITY
    // ==================================================

    queuedOutreach.forEach((outreach) => {
        const priority = calculatePriority(
            outreach,
            outreach.patientId,
            outreach.campaignId
        );

        outreach.priorityScore =
            priority.totalScore;

        outreach.priorityBreakdown =
            priority.breakdown;
    });

    // ==================================================
    // 4. SORT BY PRIORITY
    // ==================================================

    queuedOutreach.sort((a, b) => {

        // Higher priority first
        if (
            b.priorityScore !==
            a.priorityScore
        ) {
            return (
                b.priorityScore -
                a.priorityScore
            );
        }

        // If priority is equal,
        // older scheduled outreach first.
        return (
            new Date(a.scheduledAt) -
            new Date(b.scheduledAt)
        );
    });

    console.log("\nSORTED OUTREACH:");

    queuedOutreach.forEach((item, index) => {
        console.log({
            position: index + 1,
            outreachId: item._id,
            patient: item.patientId?.name,
            campaign: item.campaignId?.name,
            priorityScore: item.priorityScore,
            priorityBreakdown:
                item.priorityBreakdown
        });
    });

    // ==================================================
    // 5. CHECK HOSPITAL CAPACITY
    // ==================================================

    let hospitalActiveCount =
        await Outreach.countDocuments({
            hospitalId,
            status: "IN_PROGRESS"
        });

    console.log(
        "\nHOSPITAL ACTIVE OUTREACH:",
        hospitalActiveCount
    );

    console.log(
        "HOSPITAL OUTBOUND CAPACITY:",
        hospital.outboundCapacity
    );

    const processed = [];

    // ==================================================
    // 6. PROCESS OUTREACH
    // ==================================================

    for (const outreach of queuedOutreach) {

        const campaign =
            outreach.campaignId;

        const patient =
            outreach.patientId;

        console.log(
            "\n----------------------------------------"
        );

        console.log(
            "CHECKING OUTREACH:",
            outreach._id
        );

        console.log({
            patient: patient?.name,
            campaign: campaign?.name,
            priorityScore:
                outreach.priorityScore,
            attemptNumber:
                outreach.attemptNumber
        });

        // ==================================================
        // 6A. HOSPITAL CAPACITY
        // ==================================================

        if (
            hospitalActiveCount >=
            hospital.outboundCapacity
        ) {
            console.log(
                "HOSPITAL CAPACITY REACHED"
            );

            break;
        }

        // ==================================================
        // 6B. CAMPAIGN MUST EXIST
        // ==================================================

        if (!campaign) {
            console.log(
                "SKIPPED: Campaign not found"
            );

            continue;
        }

        // ==================================================
        // 6C. CAMPAIGN MUST BE ACTIVE
        // ==================================================

        if (
            campaign.status !== "ACTIVE"
        ) {
            console.log(
                "SKIPPED: Campaign is not ACTIVE"
            );

            continue;
        }

        // ==================================================
        // 6D. CAMPAIGN DATE CHECK
        // ==================================================

        if (
            now < new Date(campaign.startDate) ||
            now > new Date(campaign.endDate)
        ) {
            console.log(
                "SKIPPED: Outside campaign period"
            );

            continue;
        }

        // ==================================================
        // 6E. PATIENT CHECK
        // ==================================================

        if (!patient) {
            console.log(
                "SKIPPED: Patient not found"
            );

            continue;
        }

        // ==================================================
        // 6F. PATIENT FOLLOW-UP CHECK
        // ==================================================

        if (!patient.followUpRequired) {
            console.log(
                "SKIPPED: Patient does not require follow-up"
            );

            continue;
        }

        // ==================================================
        // 6G. COMMUNICATION ELIGIBILITY
        // ==================================================

        if (!patient.communicationEligible) {
            console.log(
                "SKIPPED: Patient is not eligible for communication"
            );

            continue;
        }

        // ==================================================
        // 6H. CAMPAIGN CAPACITY
        // ==================================================

        const campaignActiveCount =
            await Outreach.countDocuments({
                campaignId: campaign._id,
                status: "IN_PROGRESS"
            });

        console.log(
            "CAMPAIGN ACTIVE OUTREACH:",
            campaignActiveCount
        );

        console.log(
            "CAMPAIGN CAPACITY:",
            campaign.outboundCapacity
        );

        if (
            campaignActiveCount >=
            campaign.outboundCapacity
        ) {
            console.log(
                "SKIPPED: Campaign capacity reached"
            );

            continue;
        }

        // ==================================================
        // 6I. MOVE TO IN_PROGRESS
        // ==================================================

        console.log(
            "MOVING OUTREACH TO IN_PROGRESS..."
        );

        outreach.status =
            "IN_PROGRESS";

        outreach.startedAt =
            new Date();

        await outreach.save();

        console.log(
            "SUCCESS: Outreach moved to IN_PROGRESS"
        );

        // ==================================================
        // 6J. UPDATE ACTIVE COUNT
        // ==================================================

        hospitalActiveCount++;

        // ==================================================
        // 6K. ADD TO PROCESSED
        // ==================================================

        processed.push(outreach);
    }

    // ==================================================
    // 7. FINAL RESULT
    // ==================================================

    console.log(
        "\n========================================"
    );

    console.log(
        "QUEUE PROCESSING FINISHED"
    );

    console.log(
        "TOTAL PROCESSED:",
        processed.length
    );

    console.log(
        "PROCESSED IDS:",
        processed.map(
            (item) => item._id
        )
    );

    console.log(
        "========================================\n"
    );

    return processed;
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
    processQueue
};