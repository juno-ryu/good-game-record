import { ParticipantDto } from "@/types/participan-dto";
import { TeamDto } from "@/types/team-dto";

export type MatchDto = {
  endOfGameResult: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: "SWIFTPLAY" | "CLASSIC" | string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: "MATCHED_GAME" | string;
  gameVersion: string;
  mapId: number;
  participants: ParticipantDto[];
  platformId: string;
  queueId: number;
  teams: TeamDto[];
  tournamentCode: string;
};
