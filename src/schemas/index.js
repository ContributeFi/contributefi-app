import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const VerifyEmailSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const UsernameSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

const validateSocialUrl = (value) => {
  const urlStr = value.startsWith("http") ? value : `https://${value}`;

  try {
    const url = new URL(urlStr);
    const dotCount = (url.hostname.match(/\./g) || []).length;

    if (url.hostname.startsWith("www")) {
      return dotCount >= 2;
    } else {
      return dotCount >= 1;
    }
  } catch {
    return false;
  }
};

const socialUrlSchema = (message) =>
  z
    .string()
    .min(1, message)
    .transform((val) => (val.startsWith("http") ? val : `https://${val}`))
    .refine(validateSocialUrl, { message });

export const CreateCommunitySchema = z.object({
  communityName: z.string().min(1, "Community name is required"),
  communityUsername: z.string().min(1, "Community username is required"),
  websitePage: socialUrlSchema("Enter a valid Website URL"),
  githubPage: socialUrlSchema("Enter a valid GitHub URL"),
  twitterPage: socialUrlSchema("Enter a valid Twitter URL"),
  instagramPage: socialUrlSchema("Enter a valid Instagram URL"),
  communityDescription: z.string().optional(),
  message: z.string().optional(),
});

export const CreateGrowthQuestSchema = z
  .object({
    questTitle: z.string().min(1, "Quest title is required"),

    rewardType: z.string().min(1, "Reward type is required"),

    tokenContract: z.string().optional().nullable(),

    numberOfWinners: z
      .number({ invalid_type_error: "Number of winners is required" })
      .min(1, "Must have at least one winner"),
    pointsPerWinner: z
      .number({ invalid_type_error: "Points per winner is required" })
      .min(1, "Points per winner is required"),
    winnerSelectionMethod: z
      .string()
      .min(1, "Winner selection method is required"),
    rewardMode: z.enum(["Overall Reward", "Individual Task Reward"]).nullable(),
    runContinuously: z.boolean().default(false),
    startDate: z.date().nullable(),
    endDate: z.date().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.startDate) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date is required",
        code: "custom",
      });
    }

    if (data.rewardType === "token") {
      if (!data.tokenContract || data.tokenContract.trim() === "") {
        ctx.addIssue({
          path: ["tokenContract"],
          message: "Token contract is required",
          code: "custom",
        });
      }
    }

    if (!data.runContinuously) {
      if (!data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date is required",
          code: "custom",
        });
      }
    }

    if (
      !data.runContinuously &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be greater than start date",
        code: "custom",
      });
    }

    if (!data.rewardMode) {
      ctx.addIssue({
        path: ["rewardMode"],
        message: "Reward mode is required",
        code: "custom",
      });
    }
  });
