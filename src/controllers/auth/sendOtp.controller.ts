import { Request, Response } from "express";
import sendSms from "../../services/smsService";
import { OtpModel } from "../../models/Otp";
import bcrypt from 'bcrypt';

const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const generateHashedOtp = async (otp: string): Promise<string> => {
    const hashedOtp = await bcrypt.hash(otp, 10);
    return hashedOtp;
}

const sendOtpController = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    try {
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        const otp: string = generateOtp();
        const expiresAt: Date = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        const hashedOtp: string = await generateHashedOtp(otp);

        // Store OTP in the database
        await OtpModel.upsertOtp({
            phoneNumber,
            otp: hashedOtp,
            expiresAt,
        });

        // Send OTP via SMS
        await sendSms(phoneNumber, `Your OTP code is ${otp}`);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while sending OTP" });
    }
};

export default sendOtpController;
