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
  role: z.string(),
});

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  points: z.number().min(1),
  mayhem: z.string(),
  listGroup: z.string(),
  type: z.string(),
  source: z.string(),
  maps: z.string(),
  missionType: z.string(),
  rarity: z.number().min(1).max(5),
  notes: z.string().optional(),
});
