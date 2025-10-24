import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ riotId: string }> }
) {
  try {
    const { riotId: encodedRiotId } = await context.params;
    const riotId = decodeURIComponent(encodedRiotId);
    const [gameName, tagLine] = riotId.split("#");

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: "Invalid Riot ID format. Please use GameName#TagLine." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RIOT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured on the server." },
        { status: 500 }
      );
    }

    const accountUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;

    const accountResponse = await fetch(accountUrl, {
      headers: {
        "X-Riot-Token": apiKey,
      },
    });

    if (!accountResponse.ok) {
      if (accountResponse.status === 404) {
        return NextResponse.json(
          { error: "Riot ID not found." },
          { status: 404 }
        );
      }
      const errorData = await accountResponse.json();
      return NextResponse.json(
        {
          error: `Riot API error (Account): ${
            errorData.status?.message || "Unknown error"
          }`,
        },
        { status: accountResponse.status }
      );
    }

    const accountData = await accountResponse.json();
    const { puuid } = accountData;

    // 2. Use PUUID to get Summoner data from the correct region (e.g., KR)
    const summonerUrl = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const summonerResponse = await fetch(summonerUrl, {
      headers: {
        "X-Riot-Token": apiKey,
      },
    });

    if (!summonerResponse.ok) {
      const errorData = await summonerResponse.json();
      return NextResponse.json(
        {
          error: `Riot API error (Summoner): ${
            errorData.status?.message || "Unknown error"
          }`,
        },
        { status: summonerResponse.status }
      );
    }

    const summonerData = await summonerResponse.json();

    return NextResponse.json({
      ...summonerData,
      name: accountData?.gameName,
      tagLine: accountData?.tagLine,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
