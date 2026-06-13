import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession, emailOTP } from "better-auth/plugins";
import { prisma } from "../config/prisma.config.js";

const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL as string;
const BASE_URL = process.env.BASE_URL! as string;
const trustedOrigins = [CLIENT_FRONTEND_URL, "myapp://", BASE_URL];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins,
  baseURL: BASE_URL,
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {},
        after: async (user) => {},
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false,
    },
    useSecureCookies: true,
    cookies: {
      session_token: {
        attributes: {
          sameSite: "none",
          secure: true,
        },
      },
    },
  },
  session: {
    storeSessionInDatabase: true,
    cookieCache: {
      enabled: false,
    },
    preserveSessionInDatabase: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userDoc = await prisma.user.findFirst({
        where: { id: user.id },
      });

      return {
        user: {
          ...user,
          role: userDoc?.role,
        },
        session,
      };
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // sendEmail({
          //     html: resetPasswordTemplate({
          //         otp,
          //         appName: "Guest house booking",
          //         expiryMinutes: 5,
          //         typeLabel: "",
          //     }),
          //     subject: "",
          //     to: email,
          //     from: "Guest house booking app",
          // });
          // Send the OTP for password reset
        }
      },
      otpLength: 6,
      allowedAttempts: 100,
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
});

export const { getSession } = auth.api;
