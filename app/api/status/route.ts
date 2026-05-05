export async function GET() {
  try {
    // Minecraft server status API
    const mc = await fetch("https://api.mcsrvstat.us/2/mc.cloudberry.net")
      .then(res => res.json());

    // Discord widget (must be enabled in server settings)
    const discord = await fetch("https://discord.com/api/guilds/YOUR_GUILD_ID/widget.json")
      .then(res => res.json());

    return Response.json({
      players: mc.players?.online ?? 0,
      discord: discord.presence_count ?? "N/A",
    });

  } catch (err) {
    return Response.json({
      players: "0",
      discord: "0",
    });
  }
}
