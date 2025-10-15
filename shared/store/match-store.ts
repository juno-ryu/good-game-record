import { create } from "zustand";

export interface ParticipantDetail {
  puuid: string;
  summonerName: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  totalDamageDealtToChampions: number;
  totalMinionsKilled: number;
  goldEarned: number;
  perks: any; // Define more specifically if needed
  summoner1Id: number;
  summoner2Id: number;
}

export interface Match {
  matchId: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  win: boolean;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  teamPosition: string;
  participants: ParticipantDetail[];
}

interface MatchSummary {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: string;
  averageKDA: string;
}

interface MatchState {
  matches: Match[];
  summary: MatchSummary | null;
  isLoading: boolean;
  error: string | null;
  fetchMatches: (puuid: string) => Promise<void>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  summary: null,
  isLoading: false,
  error: null,
  fetchMatches: async (puuid: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/matches/${puuid}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch match data");
      }
      const matches: Match[] = await response.json();

      // Calculate summary
      const totalMatches = matches.length;
      const wins = matches.filter((match) => match.win).length;
      const losses = totalMatches - wins;
      const winRate =
        totalMatches > 0
          ? ((wins / totalMatches) * 100).toFixed(0) + "%"
          : "0%";

      let totalKills = 0;
      let totalDeaths = 0;
      let totalAssists = 0;

      matches.forEach((match) => {
        totalKills += match.kills;
        totalDeaths += match.deaths;
        totalAssists += match.assists;
      });

      const averageKDA =
        totalDeaths === 0
          ? (totalKills + totalAssists).toFixed(2) // Avoid division by zero
          : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

      set({
        matches,
        summary: {
          totalMatches,
          wins,
          losses,
          winRate,
          averageKDA: `${averageKDA}:1`,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
