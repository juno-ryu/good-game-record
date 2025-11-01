"use client";

import { ParticipantDto } from "@/shared/utils/types/participan-dto";
import { TeamDto } from "@/shared/utils/types/team-dto";
import { Line } from "rc-progress";

interface SummaryBarProps {
  blueTeam: ParticipantDto[];
  redTeam: ParticipantDto[];
  blueTeamStats: TeamDto;
  redTeamStats: TeamDto;
}

export default function SummaryBar({
  blueTeam,
  redTeam,
  blueTeamStats,
  redTeamStats,
}: SummaryBarProps) {
  const blueKills = blueTeam.reduce((acc, p) => acc + p.kills, 0);
  const redKills = redTeam.reduce((acc, p) => acc + p.kills, 0);
  const totalKills = blueKills + redKills;
  const blueKillsPercentage =
    totalKills > 0 ? (blueKills / totalKills) * 100 : 50;

  const blueGold = blueTeam.reduce((acc, p) => acc + p.goldEarned, 0);
  const redGold = redTeam.reduce((acc, p) => acc + p.goldEarned, 0);
  const totalGold = blueGold + redGold;
  const blueGoldPercentage = totalGold > 0 ? (blueGold / totalGold) * 100 : 50;

  return (
    <div className="flex flex-col items-center justify-center my-3 text-white text-sm">
      {/* Kills Row */}
      <div className="flex items-center justify-between w-full">
        {/* Blue Team Objectives */}
        <div className="flex gap-2 text-xs">
          <span>D: {blueTeamStats.objectives.dragon.kills}</span>
          <span>B: {blueTeamStats.objectives.baron.kills}</span>
          <span>T: {blueTeamStats.objectives.tower.kills}</span>
        </div>

        {/* Kills Bar */}
        <div className="w-1/2 relative flex items-center">
          <Line
            percent={blueKillsPercentage}
            strokeWidth={3}
            strokeColor="#4D7CFE"
            trailWidth={3}
            trailColor="#D43F3A"
            className="w-full"
          />
          <span className="absolute left-2 font-bold text-xs text-white z-10">
            {blueKills}
          </span>
          <span className="absolute right-2 font-bold text-xs text-white z-10">
            {redKills}
          </span>
        </div>

        {/* Red Team Objectives */}
        <div className="flex gap-2 text-xs">
          <span>D: {redTeamStats.objectives.dragon.kills}</span>
          <span>B: {redTeamStats.objectives.baron.kills}</span>
          <span>T: {redTeamStats.objectives.tower.kills}</span>
        </div>
      </div>

      {/* Gold Row */}
      <div className="flex items-center justify-between w-full">
        {/* Blue Team Objectives */}
        <div className="flex gap-2 text-xs">
          <span>D: {blueTeamStats.objectives.dragon.kills}</span>
          <span>B: {blueTeamStats.objectives.baron.kills}</span>
          <span>T: {blueTeamStats.objectives.tower.kills}</span>
        </div>

        {/* Gold Bar */}
        <div className="w-1/2 relative flex items-center">
          <Line
            percent={blueGoldPercentage}
            strokeWidth={3}
            strokeColor="#4D7CFE"
            trailWidth={3}
            trailColor="#D43F3A"
            className="w-full"
          />
          <span className="absolute left-2 font-bold text-xs text-white z-10">
            {(blueGold / 1000).toFixed(1)}k
          </span>
          <span className="absolute right-2 font-bold text-xs text-white z-10">
            {(redGold / 1000).toFixed(1)}k
          </span>
        </div>

        {/* Red Team Objectives */}
        <div className="flex gap-2 text-xs">
          <span>D: {redTeamStats.objectives.dragon.kills}</span>
          <span>B: {redTeamStats.objectives.baron.kills}</span>
          <span>T: {redTeamStats.objectives.tower.kills}</span>
        </div>
      </div>
    </div>
  );
}
