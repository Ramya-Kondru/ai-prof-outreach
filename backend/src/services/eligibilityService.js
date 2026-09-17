const checkEligibility = (patient, campaign, now = new Date()) => {
    // 1. Patient must require follow-up
    if (!patient.followUpRequired) {
        return {
            eligible: false,
            reason: "Follow-up is not required"
        };
    }

    // 2. Patient must be allowed to receive communication
    if (!patient.communicationEligible) {
        return {
            eligible: false,
            reason: "Patient is not eligible for communication"
        };
    }

    // 3. Campaign must be active
    if (campaign.status !== "ACTIVE") {
        return {
            eligible: false,
            reason: "Campaign is not active"
        };
    }

    // 4. Current date must be inside campaign dates
    const currentDate = new Date(now);
    const campaignStart = new Date(campaign.startDate);
    const campaignEnd = new Date(campaign.endDate);

    if (currentDate < campaignStart || currentDate > campaignEnd) {
        return {
            eligible: false,
            reason: "Current date is outside campaign period"
        };
    }

    // 5. Check days since discharge
    const dischargeDate = new Date(patient.dischargeDate);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const daysSinceDischarge =
        Math.floor(
            (currentDate - dischargeDate) / millisecondsPerDay
        );

    const minimumDays =
        campaign.followUpWindow.minimumDaysAfterDischarge;

    const maximumDays =
        campaign.followUpWindow.maximumDaysAfterDischarge;

    if (
        daysSinceDischarge < minimumDays ||
        daysSinceDischarge > maximumDays
    ) {
        return {
            eligible: false,
            reason: "Patient is outside the follow-up window",
            daysSinceDischarge
        };
    }

    // 6. Patient is eligible
    return {
        eligible: true,
        reason: "Patient is eligible for outreach",
        daysSinceDischarge
    };
};

module.exports = {
    checkEligibility
};