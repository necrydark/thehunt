"use server";
import { clipSchema } from "@/app/schemas/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

export async function submitClipAction(data: z.infer<typeof clipSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session?.user.id) {
    return { error: "User is not authorized." };
  }

  const fields = clipSchema.safeParse(data);

  if (!fields.success) {
    return { error: "Invalid Clip" };
  }

  const { itemId, clipUrl } = fields.data;

  if (!itemId || !clipUrl) {
    return { error: "Invalid Input: Item ID and Clip URL are required" };
  }

  if (!clipUrl.startsWith("https://clips.twitch.tv/")) {
    return { error: "Invalid Twitch Clip URL. Must be a Twitch Clip" };
  }

  try {
    const item = await db.item.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      return { error: "Selected item not found." };
    }

    const submission = await db.submission.findFirst({
      where: {
        itemId,
      },
    });

    if (submission) {
      return { error: "Submission already found." };
    }

    await db.submission.create({
      data: {
        userId: session?.user.id,
        itemId,
        twitchClipUrl: clipUrl,
        status: "PENDING",
      },
    });

    revalidatePath("/participant/dashboard");
    revalidatePath("/admin/submissions"); // Admin submission list
    return {
      success: true,
      message: "Clip submitted successfully! Awaiting admin review.",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error submitting clip", err);
    if (err.code === "P2002" && err.meta?.target?.includes("twitchClipUrl")) {
      return { error: "This Twitch clip has already been submitted." };
    }
    return { error: "Failed to create submission." };
  }
}
