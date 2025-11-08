"use client";

import PlayerStatsRow from "@/components/match-history/player-stats-row";
import { ParticipantDto } from "@/types/participan-dto";

import { TeamDto } from "@/types/team-dto";

interface TeamStatsProps {
  team: "승리팀" | "패배팀";
  teamData: ParticipantDto[];
  teamStats: TeamDto;
  maxDamage: number;
  ranks: Record<string, number>;
  acePuuid: string;
}

export default function TeamStats({
  team,
  teamData,
  teamStats,
  maxDamage,
  ranks,
  acePuuid,
}: TeamStatsProps) {
  const isWinner = team === "승리팀";
  const headerColor = isWinner ? "text-[#4D7CFE]" : "text-[#D43F3A]";

  const totalKills = teamData.reduce((acc, p) => acc + p.kills, 0);
  const totalDeaths = teamData.reduce((acc, p) => acc + p.deaths, 0);
  const totalAssists = teamData.reduce((acc, p) => acc + p.assists, 0);

  return (
    <div className={`rounded-lg mb-2`}>
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`text-sm font-bold ${
            isWinner ? "text-blue-400" : "text-red-400"
          }`}
        >
          {team}
        </h3>
        {/* <p className="text-sm text-white">
          {totalKills} / {totalDeaths} / {totalAssists}
        </p> */}
      </div>
      {/* Header for the player stats table */}
      <div className="grid grid-cols-9 sm:grid-cols-10 text-xs text-gray-400 px-2 py-1">
        <div className="col-span-4 sm:col-span-3">플레이어</div>
        <div className="col-span-2 sm:col-span-1">KDA</div>
        <div className="col-span-1">와드</div>
        <div className="col-span-1">CS</div>
        <div className="col-span-1">데미지</div>
        <div className="col-span-3 text-right hidden sm:flex">아이템</div>
      </div>
      <div>
        {teamData.map((participant) => (
          <PlayerStatsRow
            key={participant.puuid}
            participant={participant}
            maxDamage={maxDamage}
            rank={ranks[participant.puuid]}
            isAce={participant.puuid === acePuuid}
          />
        ))}
      </div>
    </div>
  );
}
