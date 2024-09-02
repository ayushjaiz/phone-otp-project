import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Otp {
    id?: number;
    phoneNumber: string;
    otp: string;
    expiresAt: Date;
    createdAt?: Date;
}

class OtpModel {
    static async createOtp({ phoneNumber, otp, expiresAt }: Otp): Promise<Otp> {
        try {
            const res = await prisma.otp.create({
                data: {
                    phoneNumber,
                    otp,
                    expiresAt,
                },
            });
            return res;
        } catch (error: any) {
            throw new Error('Failed to create OTP: ' + error.message);
        }
    }

    static async getOtp(phoneNumber: string): Promise<Otp | null> {
        try {
            const otpRecord = await prisma.otp.findFirst({
                where: {
                    phoneNumber: phoneNumber,
                    expiresAt: {
                        gte: new Date(), // Ensure the OTP is not expired
                    },
                },
                orderBy: {
                    createdAt: 'desc', // Get the latest OTP by creation time
                },
            });
    
            return otpRecord;
        } catch (error: any) {
            throw new Error('Failed to retrieve OTP: ' + error.message);
        }
    }

    static async deleteOtp(phoneNumber: string): Promise<void> {
        try {
            await prisma.otp.deleteMany({
                where: { phoneNumber: phoneNumber },
            });
        } catch (error: any) {
            throw new Error('Failed to delete OTP: ' + error.message);
        }
    }
}

export { Otp, OtpModel };
