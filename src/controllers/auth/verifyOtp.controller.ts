import { Request, Response } from "express";
import { UserModel } from "../../models/User";
import { OtpModel } from "../../models/Otp";
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

    try {
        if (!name || !phoneNumber || !otp) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const storedOtp = await OtpModel.getOtp(phoneNumber);

        if (!storedOtp) {
            return res.status(401).json({ error: "Invalid or expired OTP" });
        }

        const isOtpValid = await compareOtp(otp, storedOtp.otp);

        if (!isOtpValid) {
            return res.status(401).json({ error: "Invalid or expired OTP" });
        }

        // OTP is valid, proceed with the login or user creation
        await OtpModel.deleteOtp(phoneNumber);

        // Check if the user exists
        let user = await UserModel.getUser({ phoneNumber });
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
