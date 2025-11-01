// shared/components/match-history/champion-summary.tsx
"use client";

import Image from "next/image";
import { useMatchStore, ChampionStats } from "@/shared/store/match-store";

const DDRAGON_VERSION = "14.10.1"; // Data Dragon 버전 상수화

const getChampionIconUrl = (championName: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championName}.png`;

export default function ChampionSummary() {
  const { championStats, isLoading, error } = useMatchStore();

  if (isLoading) {
    return <div className="text-center py-4">Loading champion stats...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (!championStats || championStats.length === 0) {
    return null; // Or a placeholder if no champion stats are available yet
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
      <h2 className="text-md font-bold mb-4">최근 플레이한 챔피언</h2>
      <div className="space-y-3">
        {championStats.map((champ: ChampionStats) => (
          <div
            key={champ.championName}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Image
                src={getChampionIconUrl(champ.championName)}
                alt={champ.championName}
                width={40}
                height={40}
                className="rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/file.svg"; // Fallback image
                }}
                unoptimized
              />
              <div>
                <p className="font-bold">{champ.championName}</p>
                <p className="text-sm text-gray-400">
                  <span
                    className={`${
                      parseFloat(champ.winRate) >= 50
                        ? "text-blue-400"
                        : "text-red-400"
                    }`}
                  >
                    {champ.winRate}
                  </span>{" "}
                  {champ.wins}W {champ.losses}L
                </p>
              </div>
            </div>
            <p className="font-bold text-md">{champ.kda}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
