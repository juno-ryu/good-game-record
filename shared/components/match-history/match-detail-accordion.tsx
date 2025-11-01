"use client";

import { MatchDto } from "@/shared/utils/types/match-dto";
import { calculateFinalScore } from "@/shared/utils/helpers/helper";
import SummaryBar from "./summary-bar";
import TeamStats from "./team-stats";

interface MatchDetailAccordionProps {
  matchDetails: MatchDto;
}

export default function MatchDetailAccordion({
  matchDetails,
}: MatchDetailAccordionProps) {
  const maxDamage = Math.max(
    ...matchDetails.participants.map((p) => p.totalDamageDealtToChampions)
  );

  // Calculate scores and ranks
  const participantsWithScores = matchDetails.participants.map((p) => ({
    ...p,
    finalScore: calculateFinalScore(
      (p.kills + p.assists) / (p.deaths === 0 ? 1 : p.deaths),
      p.totalDamageDealtToChampions,
      maxDamage
    ),
  }));

  const sortedParticipants = [...participantsWithScores].sort(
    (a, b) => b.finalScore - a.finalScore
  );

  const ranks = sortedParticipants.reduce((acc, p, index) => {
    acc[p.puuid] = index + 1;
    return acc;
  }, {} as Record<string, number>);

  const blueTeam = participantsWithScores.filter((p) => p.teamId === 100);
  const redTeam = participantsWithScores.filter((p) => p.teamId === 200);

  const blueTeamStats = matchDetails.teams.find((t) => t.teamId === 100);
  const redTeamStats = matchDetails.teams.find((t) => t.teamId === 200);

  if (!blueTeamStats || !redTeamStats) {
    return <div>팀 정보를 불러올 수 없습니다.</div>;
  }

  const winningTeam = blueTeamStats.win ? blueTeam : redTeam;
  const losingTeam = blueTeamStats.win ? redTeam : blueTeam;

  const winningTeamStats = blueTeamStats.win ? blueTeamStats : redTeamStats;
  const losingTeamStats = blueTeamStats.win ? redTeamStats : blueTeamStats;

  const acePlayer = losingTeam.reduce((highest, p) =>
    p.finalScore > highest.finalScore ? p : highest
  );

  return (
    <div className="bg-gray-800 p-2 rounded-lg">
      <TeamStats
        team="패배팀"
        teamData={losingTeam}
        teamStats={losingTeamStats}
        maxDamage={maxDamage}
        ranks={ranks}
        acePuuid={acePlayer.puuid}
      />
      <SummaryBar
        blueTeam={blueTeam}
        redTeam={redTeam}
        blueTeamStats={blueTeamStats}
        redTeamStats={redTeamStats}
      />
      <TeamStats
        team="승리팀"
        teamData={winningTeam}
        teamStats={winningTeamStats}
        maxDamage={maxDamage}
        ranks={ranks}
        acePuuid={acePlayer.puuid}
      />
    </div>
  );
}
