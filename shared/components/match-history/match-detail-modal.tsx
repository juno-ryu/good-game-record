// shared/components/match-history/match-detail-modal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Image from "next/image"; // Next.js Image 컴포넌트 사용
import { Match, ParticipantDetail } from "@/shared/store/match-store"; // Match 인터페이스 임포트

interface MatchDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  matchId: string | null;
  matchDetails: Match | undefined; // Match 인터페이스 사용
}

const DDRAGON_VERSION = "14.10.1"; // Data Dragon 버전 상수화

// Data Dragon 이미지 URL 헬퍼 함수
const getChampionIconUrl = (championName: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championName}.png`;
const getItemIconUrl = (itemId: number) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`;
const getSpellIconUrl = (spellId: number) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${getSpellName(
    spellId
  )}.png`;
// 룬 아이콘은 별도의 경로를 가집니다. (나중에 추가)

// 소환사 주문 ID를 이름으로 변환하는 헬퍼 (간단하게 몇 가지만)
const getSpellName = (spellId: number) => {
  switch (spellId) {
    case 21:
      return "SummonerBarrier";
    case 1:
      return "SummonerBoost";
    case 14:
      return "SummonerDot";
    case 3:
      return "SummonerExhaust";
    case 4:
      return "SummonerFlash";
    case 6:
      return "SummonerHaste";
    case 7:
      return "SummonerHeal";
    case 13:
      return "SummonerMana";
    case 11:
      return "SummonerSmite";
    case 12:
      return "SummonerTeleport";
    case 32:
      return "SummonerSnowball";
    case 39:
      return "SummonerClairvoyance"; // Not common in SR
    default:
      return "SummonerFlash"; // Fallback
  }
};

export default function MatchDetailModal({
  isOpen,
  onOpenChange,
  matchId,
  matchDetails,
}: MatchDetailModalProps) {
  if (!matchId || !matchDetails) {
    return null;
  }

  const myPuuid = matchDetails.participants.find(
    (p) => p.championName === matchDetails.championName
  )?.puuid; // 내 puuid 찾기 (정확하지 않을 수 있음, 실제로는 스토어에서 가져와야 함)
  const team1 = matchDetails.participants.filter(
    (p) => p.win === matchDetails.win
  ); // 내 팀
  const team2 = matchDetails.participants.filter(
    (p) => p.win !== matchDetails.win
  ); // 상대 팀

  const renderParticipant = (participant: ParticipantDetail) => {
    const kda =
      participant.deaths === 0
        ? (participant.kills + participant.assists).toFixed(2)
        : (
            (participant.kills + participant.assists) /
            participant.deaths
          ).toFixed(2);

    return (
      <div
        key={participant.puuid}
        className="flex items-center p-2 border-b border-gray-200 last:border-b-0"
      >
        <Image
          src={getChampionIconUrl(participant.championName)}
          alt={participant.championName}
          width={30}
          height={30}
          className="rounded-full mr-2"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/file.svg";
          }}
          unoptimized // 최적화 비활성화
        />
        <div className="flex-grow">
          <p className="font-medium text-sm text-white">
            {participant.summonerName}
          </p>
          <p className="text-xs text-gray-300">{participant.championName}</p>
        </div>
        <div className="text-xs text-right text-white">
          <p>
            {participant.kills}/{participant.deaths}/{participant.assists} (
            {kda})
          </p>
          <p>CS: {participant.totalMinionsKilled}</p>
          <p>Gold: {participant.goldEarned.toLocaleString()}</p>
          <p>Damage: {participant.totalDamageDealtToChampions.toLocaleString()}</p>
          <div className="flex justify-end mt-1">
            {[
              participant.item0,
              participant.item1,
              participant.item2,
              participant.item3,
              participant.item4,
              participant.item5,
              participant.item6,
            ]
              .filter((itemId) => itemId > 0)
              .map((itemId, idx) => (
                <Image
                  key={idx}
                  src={getItemIconUrl(itemId)}
                  alt={`Item ${itemId}`}
                  width={20}
                  height={20}
                  className="rounded-sm ml-1"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/file.svg";
                  }}
                  unoptimized // 최적화 비활성화
                />
              ))}
          </div>
          <div className="flex justify-end mt-1">
            <Image
              src={getSpellIconUrl(participant.summoner1Id)}
              alt={`Spell ${participant.summoner1Id}`}
              width={18}
              height={18}
              className="rounded-sm ml-1"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/file.svg";
              }}
              unoptimized // 최적화 비활성화
            />
            <Image
              src={getSpellIconUrl(participant.summoner2Id)}
              alt={`Spell ${participant.summoner2Id}`}
              width={18}
              height={18}
              className="rounded-sm ml-1"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/file.svg";
              }}
              unoptimized // 최적화 비활성화
            />
            {/* 룬 아이콘은 별도 처리 필요 */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto">
          <Dialog.Title className="text-white m-0 text-[20px] font-bold">
            매치 상세 정보
          </Dialog.Title>
          <div className="text-white mt-[10px] mb-5 text-[15px] leading-normal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* 팀 1 (승리 또는 내 팀) */}
              <div
                className={`rounded-lg p-3 ${
                  matchDetails.win ? "bg-blue-900" : "bg-red-900"
                }`}
              >
                <h3
                  className={`font-bold text-lg mb-2 ${
                    matchDetails.win ? "text-blue-400" : "text-red-400"
                  }`}
                >
                  {matchDetails.win ? "승리 팀" : "패배 팀"}
                </h3>
                {team1.map(renderParticipant)}
              </div>
              {/* 팀 2 (패배 또는 상대 팀) */}
              <div
                className={`rounded-lg p-3 ${
                  matchDetails.win ? "bg-red-900" : "bg-blue-900"
                }`}
              >
                <h3
                  className={`font-bold text-lg mb-2 ${
                    matchDetails.win ? "text-red-400" : "text-blue-400"
                  }`}
                >
                  {matchDetails.win ? "패배 팀" : "승리 팀"}
                </h3>
                {team2.map(renderParticipant)}
              </div>
            </div>
          </div>
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button className="bg-gray-700 text-white hover:bg-gray-600 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                닫기
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-gray-300 hover:bg-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
