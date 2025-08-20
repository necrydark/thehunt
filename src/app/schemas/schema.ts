import * as z from "zod";

export const clipSchema = z.object({
  itemId: z.string(),
  clipUrl: z.string(),
});

export const submissionSchema = z.object({
  submissionId: z.string(),
  status: z.string(),
  rejectReason: z.string(),
});

export const weaponSubmission = z.object({
  itemId: z.string(),
  twitchClipLink: z.string(),
});

export const submissionReview = z.object({
  id: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

export const banUserSchema = z.object({
  userId: z.string(),
  banReason: z.string().optional(),
  banExpiresIn: z.date().optional(),
});

export const unbanUserSchema = z.object({
  userId: z.string(),
});

export const userUpdateSchema = z.object({
  userId: z.string(),
  role: z.enum(["Participant", "Reviewer", "Admin"]),
});
