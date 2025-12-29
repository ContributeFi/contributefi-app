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
    rewardType: z.enum(["token", "cash"], {
      required_error: "Reward type is required",
    }),
    tokenContract: z.string().optional(),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date().optional(),
    runContinuously: z.boolean().optional(),
    numberOfWinners: z
      .number({ invalid_type_error: "Number of winners is required" })
      .min(1, "Must have at least one winner"),
    winnerSelectionMethod: z.string().min(1, "Selection method is required"),
    tasks: z.array(
      z.object({
        type: z.string().min(1, "Task type is required"),
        points: z.number().min(1, "Points must be at least 1"),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.rewardType === "token" && !data.tokenContract?.trim()) {
      ctx.addIssue({
        path: ["tokenContract"],
        message: "Token contract is required for token rewards",
        code: "custom",
      });
    }

    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be after start date",
        code: "custom",
      });
    }

    if (!data.runContinuously && !data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date is required",
        code: "custom",
      });
    }
  });
