const Communication = require("../models/Communication");
const Observation = require("../models/Observation");
const FollowUp = require("../models/FollowUp");
const Escalation = require("../models/Escalation");


// ======================================================
// CREATE COMMUNICATION RECORD
// ======================================================

const createCommunication = async ({
    hospitalId,
    patientId,
    outreachId,
    conversationId,
    sender,
    message
}) => {

    try {

        let direction = "OUTBOUND";

        if (sender === "PATIENT") {
            direction = "INBOUND";
        }

        const communication =
            await Communication.create({

                hospitalId,

                patientId,

                outreachId,

                conversationId,

                sender,

                channel: "CHAT",

                message,

                direction,

                status: "SENT",

                communicatedAt: new Date()

            });

        return communication;

    } catch (error) {

        console.error(
            "Create communication error:",
            error.message
        );

        throw error;
    }
};


// ======================================================
// CREATE OBSERVATION
// ======================================================

const createObservation = async ({
    hospitalId,
    patientId,
    outreachId,
    conversationId,
    type,
    name,
    value,
    unit,
    referenceRange,
    status,
    source
}) => {

    try {

        const observation =
            await Observation.create({

                hospitalId,

                patientId,

                outreachId,

                conversationId,

                type,

                name,

                value,

                unit,

                referenceRange,

                status,

                source,

                observedAt: new Date()

            });

        return observation;

    } catch (error) {

        console.error(
            "Create observation error:",
            error.message
        );

        throw error;
    }
};


// ======================================================
// CREATE FOLLOW-UP
// ======================================================

const createFollowUp = async ({
    hospitalId,
    patientId,
    outreachId,
    conversationId,
    type,
    reason,
    dueDate,
    notes
}) => {

    try {

        const followUp =
            await FollowUp.create({

                hospitalId,

                patientId,

                outreachId,

                conversationId,

                type,

                reason,

                dueDate,

                status: "PENDING",

                notes

            });

        return followUp;

    } catch (error) {

        console.error(
            "Create follow-up error:",
            error.message
        );

        throw error;
    }
};


// ======================================================
// CREATE ESCALATION
// ======================================================

const createEscalation = async ({
    hospitalId,
    patientId,
    outreachId,
    conversationId,
    urgency,
    reason,
    trigger,
    requiresHumanReview
}) => {

    try {

        const escalation =
            await Escalation.create({

                hospitalId,

                patientId,

                outreachId,

                conversationId,

                urgency,

                reason,

                trigger,

                requiresHumanReview,

                status: "OPEN"

            });

        return escalation;

    } catch (error) {

        console.error(
            "Create escalation error:",
            error.message
        );

        throw error;
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    createCommunication,

    createObservation,

    createFollowUp,

    createEscalation

};