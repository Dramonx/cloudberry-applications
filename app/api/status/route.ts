export async function GET() {
  try {
    const mc = await fetch(
      "https://api.mcstatus.io/v2/status/java/mc.cloudberry.net"
    ).then(res => res.json());

    const discordRes = await fetch(
      "https://discord.com/api/guilds/1263235716750512199/widget.json"
    );

    const discord = await discordRes.json();

    return Response.json({
      players: mc.players?.online ?? 0,
      max: mc.players?.max ?? 0,
      discord: discord.presence_count ?? "0",
    });

  } catch (err) {
    return Response.json({
      players: 0,
      max: 0,
      discord: 0,
    });
  }
}
