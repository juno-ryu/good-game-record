import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ puuid: string }> }
) {
  const { puuid } = await context.params; // await 추가

  if (!puuid) {
    return NextResponse.json({ error: "PUUID is required" }, { status: 400 });
  }

  try {
    // 1. Fetch match IDs
    const matchIdsResponse = await fetch(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`, // Fetching 20 matches as per PRD2
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY || "",
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!matchIdsResponse.ok) {
      const errorData = await matchIdsResponse.json();
      return NextResponse.json(
        { error: "Failed to fetch match IDs", details: errorData },
        { status: matchIdsResponse.status }
      );
    }

    const matchIds: string[] = await matchIdsResponse.json();
    // 2. Fetch detailed match data for each match ID
    const matchDetailsPromises = matchIds.map(async (matchId) => {
      const matchDetailResponse = await fetch(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            "X-Riot-Token": process.env.RIOT_API_KEY || "",
          },
          next: { revalidate: 60 }, // Revalidate every 60 seconds
        }
      );

      if (!matchDetailResponse.ok) {
        console.error(`Failed to fetch details for match ${matchId}`);
        return null; // Or handle error more specifically
      }
      return matchDetailResponse.json();
    });

    const matchDetails = (await Promise.all(matchDetailsPromises))
      .filter((match) => match !== null)
      .map((match) => match.info);

    return NextResponse.json(matchDetails);
  } catch (error: any) {
    console.error("Error fetching match data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
