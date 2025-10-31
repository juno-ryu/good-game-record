import { ParticipantDto } from "@/shared/utils/types/participan-dto";
import { TeamDto } from "@/shared/utils/types/team-dto";

export type MatchDto = {
  endOfGameResult: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: "SWIFTPLAY" | "CLASSIC" | string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: ParticipantDto[];
  platformId: string;
  queueId: number;
  teams: TeamDto[];
  tournamentCode: string;
};
