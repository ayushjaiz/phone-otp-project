import { Request, Response } from "express";
import { User, UserModel } from "../../models/User";
import { Otp, OtpModel } from "../../models/Otp";
import bcrypt from 'bcrypt';

const compareOtp = async (enteredOtp: string, storedOtp: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(enteredOtp, storedOtp);
    } catch (err) {
        console.error('Error comparing OTP:', err);
        return false;
    }
}

const verifyOtpController = async (req: Request, res: Response) => {
    const { name, phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
         res.status(400).json({ error: "Phone number and OTP are required" });
         return;
    }

    try {
        // Check if user already exists
        let user: User | null = await UserModel.getUser({ phoneNumber });

        // If user doesn't previously exist, check if name is provided
        if (!user && !name) {
            return res.status(400).json({ error: "Name is required for new users" });
        }

        const storedOtp: Otp | null = await OtpModel.getOtp(phoneNumber);

        if (!storedOtp) {
            return res.status(401).json({ error: "Invalid or expired OTP" });
        }

        // Check if OTP is expired
        if (new Date() > storedOtp.expiresAt) {
            await OtpModel.deleteOtp(phoneNumber);  // Clean up expired OTP
            return res.status(401).json({ error: "OTP has expired" });
        }

        const isOtpValid: boolean = await compareOtp(otp, storedOtp.otp);
        if (!isOtpValid) {
            return res.status(401).json({ error: "Invalid OTP" });
        }

        // OTP is valid, proceed
        await OtpModel.deleteOtp(phoneNumber);

        if (!user) {
            user = await UserModel.createUser({ name, phoneNumber });
            return res.status(200).json({ message: "Successful login, user created in the database", user });
        }

        // User exists, return successful login
        return res.status(200).json({ message: "Successful login, user already in database", user });
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: "An error occurred while verifying OTP" });
    }
};


export default verifyOtpController;
