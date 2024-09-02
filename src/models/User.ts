import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

interface User {
    id?: number;
    name: string;
    phoneNumber: string;
    createdAt?: Date;
}

interface updateUserParams {
    phoneNumber?: string;
    password?: string;
}

class UserModel {
    /**
     * Adds a new user information in the database.
     * 
     * @param User - User object containing name, phoneNumber to add.
     */
    static async createUser({ name, phoneNumber }: User): Promise<User> {
        try {
            // console.log("phoneNumber" + phoneNumber);
            const res = await prisma.user.create({
                data: {
                    name,
                    phoneNumber,
                }
            });
            return res;
        } catch (error: any) {
            throw new Error('Failed to create user: ' + error.message);
        }
    }

    /**
     * Retrieve user information from the database.
     * 
     * @param phoneNumber - Email address of the user to retrieve.
     * @param id - Id of the user to retrieve.
     */
    static async getUser(options: { phoneNumber?: string, id?: number }): Promise<User | null> {
        try {
            const { phoneNumber, id } = options;

            // Use findFirst to search by either phoneNumber or id
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { phoneNumber: phoneNumber },
                        { id: id }
                    ]
                }
            });

            return user;
        } catch (error: any) {
            throw new Error('Failed to retrieve user: ' + error.message);
        }
    }

    /**
     * Updates user information in the database.
     * 
     * @param id - ID of the user to update..
     * @param phoneNumber - New phoneNumber address of the user.
     * @param password - New password of the user.
     */
    static async updateUser(id: number, { phoneNumber, password }: updateUserParams): Promise<User> {
        try {
            const data: { phoneNumber?: string, password?: string } = {};
            if (phoneNumber) data.phoneNumber = phoneNumber;
            if (password) data.password = password;

            // Use Prisma's update method to update the user
            const result = await prisma.user.update({
                where: { id: id },
                data: data,
            });

            return result;
        } catch (error: any) {
            throw new Error('Failed to update user: ' + error.message);
        }
    }
}

export { User, UserModel };