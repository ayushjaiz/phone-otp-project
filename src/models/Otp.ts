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
    static async upsertOtp({ phoneNumber, otp, expiresAt }: Otp): Promise<Otp> {
        try {
            const upsertedOtp = await prisma.otp.upsert({
                where: { phoneNumber },
                update: {
                    otp,
                    expiresAt,
                },
                create: {
                    phoneNumber,
                    otp,
                    expiresAt,
                },
            });

            return upsertedOtp;
        } catch (error: any) {
            throw new Error('Failed to upsert OTP: ' + error.message);
        }
    }

    static async getOtp(phoneNumber: string): Promise<Otp | null> {
        try {
            const otpRecord = await prisma.otp.findFirst({
                where: { phoneNumber },
            });

            return otpRecord;
        } catch (error: any) {
            throw new Error('Failed to retrieve OTP: ' + error.message);
        }
    }


    static async deleteOtp(phoneNumber: string): Promise<void> {
        try {
            await prisma.otp.deleteMany({
                where: { phoneNumber },
            });
        } catch (error: any) {
            throw new Error('Failed to delete OTP: ' + error.message);
        }
    }
}

export { Otp, OtpModel };
