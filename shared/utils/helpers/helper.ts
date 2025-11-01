import { MatchDto } from "@/shared/utils/types/match-dto";
import { ParticipantDto } from "@/shared/utils/types/participan-dto";

export const getMultiKillLabel = (participant: ParticipantDto): string => {
  if (participant.pentaKills > 0) {
    return "펜타킬";
  }
  if (participant.quadraKills > 0) {
    return "쿼드라킬";
  }
  if (participant.tripleKills > 0) {
    return "트리플킬";
  }
  if (participant.doubleKills > 0) {
    return "더블킬";
  }
  return "";
};

export const formattedGameMode = (
  mode: MatchDto["gameMode"],
  type: MatchDto["gameType"]
) => {
  if (mode === "CLASSIC" && type === "MATCHED_GAME") {
    return "개인/2인 랭크";
  }
  if (mode === "SWIFTPLAY" && type === "MATCHED_GAME") {
    return "신속 대전";
  }

  return "알수 없음";
};

export const calculateFinalScore = (
  kdaRatio: number,
  participantDamage: number,
  maxDamage: number
): number => {
  // KDA score is capped at 10 for balance.
  const kdaScore = Math.min(kdaRatio, 10);

  // Damage score is normalized to a 0-10 scale.
  const damageScore = (participantDamage / maxDamage) * 10;

  // The final score is a weighted sum of KDA and damage.
  const finalScore = kdaScore * 0.6 + damageScore * 0.4;

  return finalScore;
};

export const getRankLabelProps = (rank: number, isAce: boolean) => {
  if (rank === 1) {
    return { bgColor: "bg-yellow-600", text: "MVP" };
  }
  if (isAce) {
    return { bgColor: "bg-purple-600", text: "ACE" };
  }
  if (rank === 10) {
    return { bgColor: "bg-red-600", text: "폐급" };
  }
  if (rank > 0 && rank < 10) {
    return { bgColor: "bg-gray-600", text: `${rank}등` };
  }
  return null;
};
