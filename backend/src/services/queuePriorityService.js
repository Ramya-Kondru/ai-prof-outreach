const calculatePriority = (outreach, patient, campaign) => {
    const now = new Date();

    // --------------------------------
    // 1. Clinical Risk: 0 - 30
    // --------------------------------

    let riskScore = 10;

    const risk =
        patient?.clinicalRisk ||
        patient?.riskLevel ||
        patient?.riskCategory;

    if (typeof risk === "number") {
        if (risk >= 8) riskScore = 30;
        else if (risk >= 5) riskScore = 20;
        else riskScore = 10;
    } else if (typeof risk === "string") {
        const normalizedRisk = risk.toUpperCase();

        if (
            normalizedRisk === "HIGH" ||
            normalizedRisk === "URGENT"
        ) {
            riskScore = 30;
        } else if (
            normalizedRisk === "MEDIUM" ||
            normalizedRisk === "MODERATE"
        ) {
            riskScore = 20;
        } else {
            riskScore = 10;
        }
    }

    // --------------------------------
    // 2. Deadline Pressure: 0 - 40
    // --------------------------------

    let deadlineScore = 0;

    if (
        patient?.dischargeDate &&
        campaign?.followUpWindow?.maximumDaysAfterDischarge
    ) {
        const dischargeDate = new Date(
            patient.dischargeDate
        );

        const deadline = new Date(dischargeDate);

        deadline.setDate(
            deadline.getDate() +
            campaign.followUpWindow.maximumDaysAfterDischarge
        );

        const totalWindow =
            campaign.followUpWindow.maximumDaysAfterDischarge *
            24 *
            60 *
            60 *
            1000;

        const remainingTime =
            deadline.getTime() - now.getTime();

        const elapsedTime =
            now.getTime() - dischargeDate.getTime();

        const usedPercentage =
            totalWindow > 0
                ? elapsedTime / totalWindow
                : 0;

        if (remainingTime <= 0) {
            deadlineScore = 40;
        } else if (usedPercentage >= 0.9) {
            deadlineScore = 40;
        } else if (usedPercentage >= 0.75) {
            deadlineScore = 30;
        } else if (usedPercentage >= 0.5) {
            deadlineScore = 20;
        } else {
            deadlineScore = 10;
        }
    }

    // --------------------------------
    // 3. Campaign Priority: 0 - 20
    // --------------------------------

    const campaignPriority =
        Number(campaign?.priority) || 1;

    const campaignScore =
        Math.min(campaignPriority, 10) * 2;

    // --------------------------------
    // 4. Retry Pressure: 0 - 15
    // --------------------------------

    const attemptNumber =
        Number(outreach?.attemptNumber) || 1;

    const retryScore =
        Math.min(attemptNumber - 1, 3) * 5;

    // --------------------------------
    // 5. Time Since Discharge: 0 - 10
    // --------------------------------

    let dischargeScore = 0;

    if (patient?.dischargeDate) {
        const dischargeDate =
            new Date(patient.dischargeDate);

        const hoursSinceDischarge =
            (now.getTime() -
                dischargeDate.getTime()) /
            (1000 * 60 * 60);

        if (hoursSinceDischarge >= 72) {
            dischargeScore = 10;
        } else if (hoursSinceDischarge >= 48) {
            dischargeScore = 7;
        } else if (hoursSinceDischarge >= 24) {
            dischargeScore = 5;
        } else {
            dischargeScore = 2;
        }
    }

    // --------------------------------
    // 6. Fairness / Waiting Time: 0 - 10
    // --------------------------------

    let waitingScore = 0;

    if (outreach?.createdAt) {
        const waitingHours =
            (now.getTime() -
                new Date(outreach.createdAt).getTime()) /
            (1000 * 60 * 60);

        waitingScore =
            Math.min(Math.floor(waitingHours), 10);
    }

    // --------------------------------
    // Final Score
    // --------------------------------

    const totalScore =
        riskScore +
        deadlineScore +
        campaignScore +
        retryScore +
        dischargeScore +
        waitingScore;

    return {
        totalScore,
        breakdown: {
            riskScore,
            deadlineScore,
            campaignScore,
            retryScore,
            dischargeScore,
            waitingScore
        }
    };
};

module.exports = {
    calculatePriority
};