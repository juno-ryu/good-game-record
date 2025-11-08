"use client";

import { create } from "zustand";
import { MatchDto } from "@/utils/types/match-dto";

// ----------------- UI에 필요한 타입 정의 -----------------

// 전적 요약 정보를 담는 인터페이스
export interface MatchSummary {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: string;
  averageKDA: string;
  averageKills: number;
  averageDeaths: number;
  averageAssists: number;
  killParticipation: string;
}

// 챔피언별 통계 정보를 담는 인터페이스
export interface ChampionStats {
  championName: string;
  wins: number;
  losses: number;
  winRate: string;
  kda: string;
  totalGames: number;
}

// Zustand 스토어의 전체 상태 인터페이스
interface MatchState {
  matches: MatchDto[]; // MatchDto를 직접 사용
  summary: MatchSummary | null;
  championStats: ChampionStats[];
  isLoading: boolean;
  error: string | null;
  fetchMatches: (puuid: string) => Promise<void>;
}

// ----------------- 데이터 처리 헬퍼 함수 -----------------

const calculateKDAString = (
  kills: number,
  deaths: number,
  assists: number
): string => {
  if (deaths === 0) {
    return "Perfect";
  }
  return ((kills + assists) / deaths).toFixed(2);
};

// ----------------- Zustand 스토어 생성 -----------------

export const useMatchStore = create<MatchState>((set) => ({
  // 초기 상태
  matches: [],
  summary: null,
  championStats: [],
  isLoading: false,
  error: null,

  fetchMatches: async (puuid: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. API를 통해 원시 매치 데이터(MatchDto[]) 가져오기
      const response = await fetch(`/api/matches/${puuid}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch match data");
      }
      const rawMatches: MatchDto[] = await response.json();

      if (rawMatches.length === 0) {
        set({
          matches: [],
          summary: null,
          championStats: [],
          isLoading: false,
        });
        return;
      }

      // 2. 데이터 계산 (요약 및 챔피언 통계)
      let totalKills = 0;
      let totalDeaths = 0;
      let totalAssists = 0;
      let totalKillParticipation = 0;
      let wins = 0;
      const championStatsMap = new Map<
        string,
        {
          wins: number;
          losses: number;
          kills: number;
          deaths: number;
          assists: number;
          totalGames: number;
        }
      >();

      rawMatches.forEach((match) => {
        const mainParticipant = match.participants.find(
          (p) => p.puuid === puuid
        );
        if (!mainParticipant) return;

        // 요약 정보 계산을 위한 집계
        if (mainParticipant.win) wins++;
        totalKills += mainParticipant.kills;
        totalDeaths += mainParticipant.deaths;
        totalAssists += mainParticipant.assists;
        totalKillParticipation += mainParticipant.challenges.killParticipation;

        // 챔피언별 통계 집계
        const champName = mainParticipant.championName;
        const champStat = championStatsMap.get(champName) || {
          wins: 0,
          losses: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
          totalGames: 0,
        };
        champStat.totalGames++;
        if (mainParticipant.win) champStat.wins++;
        else champStat.losses++;
        champStat.kills += mainParticipant.kills;
        champStat.deaths += mainParticipant.deaths;
        champStat.assists += mainParticipant.assists;
        championStatsMap.set(champName, champStat);
      });

      // 3. 최종 통계 계산
      const totalMatches = rawMatches.length;
      const losses = totalMatches - wins;

      const summary: MatchSummary = {
        totalMatches,
        wins,
        losses,
        winRate:
          totalMatches > 0
            ? `${Math.round((wins / totalMatches) * 100)}%`
            : "0%",
        averageKills: totalKills / totalMatches,
        averageDeaths: totalDeaths / totalMatches,
        averageAssists: totalAssists / totalMatches,
        averageKDA: calculateKDAString(totalKills, totalDeaths, totalAssists),
        killParticipation:
          totalMatches > 0
            ? `${Math.round((totalKillParticipation / totalMatches) * 100)}%`
            : "0%",
      };

      const championStats: ChampionStats[] = Array.from(
        championStatsMap.entries()
      )
        .map(([championName, stats]) => ({
          championName,
          wins: stats.wins,
          losses: stats.losses,
          totalGames: stats.totalGames,
          winRate:
            stats.totalGames > 0
              ? `${Math.round((stats.wins / stats.totalGames) * 100)}%`
              : "0%",
          kda: calculateKDAString(stats.kills, stats.deaths, stats.assists),
        }))
        .sort((a, b) => b.totalGames - a.totalGames);

      // 4. 계산된 데이터와 원본 매치 데이터로 상태 업데이트
      set({
        matches: rawMatches, // 원본 MatchDto[]를 그대로 저장
        summary,
        championStats,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
