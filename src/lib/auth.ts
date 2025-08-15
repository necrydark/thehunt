import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
 
const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        twitch: {
            clientId: process.env.TWITCH_CLIENT_ID as string,
            clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
            scope: ['user:read:email', "clips:edit"]
        }
    },
    user: {
        additionalFields: {
            role: { 
                type: "string", 
                required: false, // Changed from true
                defaultValue: "Participant" 
            },
            totalPoints: {
                type: "number",
                input: false,
                required: false, // Added this
                defaultValue: 0,
            },
        }
    },

    plugins: [nextCookies()],

});