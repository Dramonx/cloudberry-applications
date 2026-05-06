export async function GET() {
  try {
    // Minecraft status
    const mcRes = await fetch("https://api.mcstatus.io/v2/status/java/mc-cloudberry.net");
    const mc = await mcRes.json();

    // Discord widget (MAKE SURE widget is enabled)
    const discordRes = await fetch("https://discord.com/api/guilds/YOUR_GUILD_ID/widget.json");
    const discord = await discordRes.json();

    return Response.json({
      players: mc.players?.online ?? 0,
      max: mc.players?.max ?? 0,
      discord: discord.presence_count ?? "N/A"
    });

  } catch (err) {
    return Response.json({
      players: 0,
      max: 0,
      discord: "0"
    });
  }
}
