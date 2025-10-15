import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { puuid: string } }
) {
  const { puuid } = await params; // await 추가

  if (!puuid) {
    return NextResponse.json({ error: 'PUUID is required' }, { status: 400 });
  }

  try {
    // 1. Fetch match IDs
    const matchIdsResponse = await fetch(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`, // Fetching 20 matches as per PRD2
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY || '',
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!matchIdsResponse.ok) {
      const errorData = await matchIdsResponse.json();
      return NextResponse.json(
        { error: 'Failed to fetch match IDs', details: errorData },
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
            'X-Riot-Token': process.env.RIOT_API_KEY || '',
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

    const matchDetails = (await Promise.all(matchDetailsPromises)).filter(
      (match) => match !== null
    );

    // 3. Process and extract relevant data (as per PRD2)
    const processedMatches = matchDetails.map((match: any) => {
      const participant = match.info.participants.find(
        (p: any) => p.puuid === puuid
      );

      if (!participant) {
        return null; // Should not happen if PUUID is correct
      }

      return {
        matchId: match.metadata.matchId,
        gameCreation: match.info.gameCreation,
        gameDuration: match.info.gameDuration,
        gameEndTimestamp: match.info.gameEndTimestamp,
        win: participant.win,
        championName: participant.championName,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        teamPosition: participant.teamPosition,
        // Add more details as needed for the modal
        participants: match.info.participants.map((p: any) => ({
          puuid: p.puuid,
          summonerName: p.summonerName,
          championName: p.championName,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          win: p.win,
          item0: p.item0,
          item1: p.item1,
          item2: p.item2,
          item3: p.item3,
          item4: p.item4,
          item5: p.item5,
          item6: p.item6,
          totalDamageDealtToChampions: p.totalDamageDealtToChampions,
          totalMinionsKilled: p.totalMinionsKilled,
          goldEarned: p.goldEarned,
          perks: p.perks, // Runes
          summoner1Id: p.summoner1Id, // Summoner spell 1
          summoner2Id: p.summoner2Id, // Summoner spell 2
        })),
      };
    }).filter(match => match !== null);

    return NextResponse.json(processedMatches);
  } catch (error: any) {
    console.error('Error fetching match data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}