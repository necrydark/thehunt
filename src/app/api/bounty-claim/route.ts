/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  bountyId: string;
  twitchClipUrl: string;
  message?: string;
  mentionRole?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { bountyId, twitchClipUrl, message, mentionRole = true } = body;

    if (!bountyId || !message || !twitchClipUrl) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!process.env.DISCORD_ADMIN_WEBHOOK_URL) {
      console.error("DISCORD_WEBHOOK_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const embed = {
      title: "🎯 Bounty Claimed!",
      color: 0x7c3aed,
      fields: [
        {
          name: "📋 Title",
          value: bountyId,
          inline: false,
        },
        {
          name: "📷 Twitch Clip URL",
          value: twitchClipUrl,
          inline: true,
        },
        {
          name: "🎯 Message",
          value: message,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Bounty System",
      },
    };

    const roleId = process.env.DISCORD_ADMIN_ROLE_ID;

    const payload: any = {
      embeds: [embed],
    };

    if (mentionRole && roleId) {
      payload.content = `<@&${roleId}>`;
      payload.allowed_mentions = {
        roles: [roleId],
      };
    }

    await axios.post(process.env.DISCORD_ADMIN_WEBHOOK_URL, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discord webhook error:", error);
    return NextResponse.json(
      { error: "Failed to send Discord message" },
      { status: 500 }
    );
  }
}
