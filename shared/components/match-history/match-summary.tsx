// shared/components/match-history/match-summary.tsx
"use client";

import { useMatchStore } from "@/shared/store/match-store";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function MatchSummary() {
  const { summary, isLoading, error } = useMatchStore();

  if (isLoading) {
    return <div className="text-center py-4">Loading summary...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (!summary) {
    return null; // Or a placeholder if no summary is available yet
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white mb-4">
      <p className="text-md mb-4">
        {summary.totalMatches}G {summary.wins}W {summary.losses}L
      </p>
      <div className="flex items-center justify-between">
        <div className="relative w-24 h-24">
          <CircularProgressbar
            value={parseFloat(summary.winRate) || 0}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,

              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "round",

              // Text size
              textSize: "18px",

              // Colors
              pathColor: `#8B5CF6`,
              textColor: "#fff",
              trailColor: "#4B5563",
              backgroundColor: "#3e98c7",
            })}
            // Custom text rendering for multi-line
            className="text-white"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-lg font-bold">{summary.winRate}</span>
            <span className="text-sm font-normal">승률</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-md text-gray-300">
            {summary.averageKills} /{" "}
            <span className="text-red-400">{summary.averageDeaths}</span> /{" "}
            {summary.averageAssists}
          </p>
          <p className="text-md font-bold">{summary.averageKDA}</p>
          <p className="text-sm text-red-400">
            {summary.killParticipation} 킬 관여율
          </p>
        </div>
      </div>
    </div>
  );
}
