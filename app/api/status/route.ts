const SERVER_ADDRESS = "mc-cloudberry.net";
const DISCORD_INVITE = "cloudberry";

type MinecraftStatus = {
  online?: boolean;
  players?: {
    online?: number | null;
    max?: number | null;
  };
};

type DiscordInvite = {
  approximate_member_count?: number | null;
};

export const dynamic = "force-dynamic";

export async function GET() {
  let online = false;
  let players = 0;
  let max = 0;
  let discord = 0;

  try {
    const mcRes = await fetch(
      `https://api.mcstatus.io/v2/status/java/${SERVER_ADDRESS}`,
      { cache: "no-store" }
    );

    if (mcRes.ok) {
      const mc = (await mcRes.json()) as MinecraftStatus;
      online = Boolean(mc.online);
      players = mc.players?.online ?? 0;
      max = mc.players?.max ?? 0;
    }
  } catch (err) {
    console.error("Failed to fetch Minecraft status", err);
  }

  try {
    const discordRes = await fetch(
      `https://discord.com/api/v10/invites/${DISCORD_INVITE}?with_counts=true`,
      { cache: "no-store" }
    );

    if (discordRes.ok) {
      const discordData = (await discordRes.json()) as DiscordInvite;
      discord = discordData.approximate_member_count ?? 0;
    }
  } catch (err) {
    console.error("Failed to fetch Discord invite status", err);
  }

  return Response.json({
    online,
    players,
    max,
    discord,
  });
}
