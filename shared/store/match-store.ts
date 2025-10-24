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
  teamId: number; // Add teamId
}

export interface Match {
  matchId: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  win: boolean;
  summonerName: string;
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
  averageKills: string;
  averageDeaths: string;
  averageAssists: string;
  killParticipation: string;
}

export interface ChampionStats {
  championName: string;
  wins: number;
  losses: number;
  winRate: string;
  kda: string;
}

interface MatchState {
  matches: Match[];
  summary: MatchSummary | null;
  championStats: ChampionStats[];
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

      console.log(matches);
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
      let totalKillParticipation = 0;

      matches.forEach((match) => {
        const participant = match.participants.find((p) => p.puuid === puuid);
        if (participant) {
          totalKills += participant.kills;
          totalDeaths += participant.deaths;
          totalAssists += participant.assists;

          const teamId = participant.teamId;

          const teamKills = match.participants
            .filter((p) => p.teamId === teamId)
            .reduce((sum: number, p) => sum + p.kills, 0);

          if (teamKills > 0) {
            totalKillParticipation +=
              (participant.kills + participant.assists) / teamKills;
          }
        }
      });

      const averageKills = (totalKills / totalMatches).toFixed(1);
      const averageDeaths = (totalDeaths / totalMatches).toFixed(1);
      const averageAssists = (totalAssists / totalMatches).toFixed(1);

      const averageKDA =
        totalDeaths === 0
          ? (totalKills + totalAssists).toFixed(2) // Avoid division by zero
          : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

      const killParticipation = 
        totalMatches > 0
          ? ((totalKillParticipation / totalMatches) * 100).toFixed(0) + "%"
          : "0%";

      // Calculate champion statistics
      const championStatsMap = new Map<string, {
        wins: number;
        losses: number;
        totalGames: number;
        kills: number;
        deaths: number;
        assists: number;
      }>();

      matches.forEach((match) => {
        const participant = match.participants.find((p) => p.puuid === puuid);
        if (participant) {
          const championName = participant.championName;
          const currentStats = championStatsMap.get(championName) || {
            wins: 0,
            losses: 0,
            totalGames: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
          };

          currentStats.totalGames++;
          if (participant.win) {
            currentStats.wins++;
          } else {
            currentStats.losses++;
          }
          currentStats.kills += participant.kills;
          currentStats.deaths += participant.deaths;
          currentStats.assists += participant.assists;

          championStatsMap.set(championName, currentStats);
        }
      });

      const calculatedChampionStats: ChampionStats[] = Array.from(championStatsMap.entries()).map(
        ([championName, stats]) => {
          const winRate = 
            stats.totalGames > 0
              ? ((stats.wins / stats.totalGames) * 100).toFixed(0) + "%"
              : "0%";
          const kda = 
            stats.deaths === 0
              ? (stats.kills + stats.assists).toFixed(2) // Avoid division by zero
              : ((stats.kills + stats.assists) / stats.deaths).toFixed(2);

          return {
            championName,
            wins: stats.wins,
            losses: stats.losses,
            winRate,
            kda: `${kda}:1`,
          };
        }
      ).sort((a, b) => b.wins + b.losses - (a.wins + a.losses)); // Sort by total games played (descending)

      set({
        matches,
        summary: {
          totalMatches,
          wins,
          losses,
          winRate,
          averageKDA: `${averageKDA}:1`,
          averageKills,
          averageDeaths,
          averageAssists,
          killParticipation,
        },
        championStats: calculatedChampionStats,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
