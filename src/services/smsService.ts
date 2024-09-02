import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });

import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSms = async (phoneNumber: string, body: string) => {
    try {
        const message = await client.messages.create({
            body: body,
            from: '+15306658557',
            to: phoneNumber,
        });

        console.log(message.body);
    } catch (error: any) {
        throw new Error('Failed to send OTP: ' + error.message);
    }

}

export default sendSms;