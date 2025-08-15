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
