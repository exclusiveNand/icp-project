import { oasis_backend } from "../../../declarations/oasis_backend";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validateAadhaar(aadhaarNumber) {
    const aadhaarPattern = /^\d{12}$/;
    return aadhaarPattern.test(aadhaarNumber);
}

async function isAdmin(phone) {
    var resp = await oasis_backend.getAdmin();
    if (resp == phone) {
        return true;
    }
    return false;
}

export { getRandomInt, validateAadhaar, isAdmin }