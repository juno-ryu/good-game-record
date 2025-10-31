"use client";
import Image from "next/image";
import { MatchDto } from "@/shared/utils/types/match-dto";
import { ParticipantDto } from "@/shared/utils/types/participan-dto";

interface MatchDetailAccordionProps {
  matchDetails: MatchDto;
}

import {
  getChampionIconUrl,
  getItemIconUrl,
  getSpellIconUrl,
} from "@/shared/utils/helpers/ddragon-urls";

const renderParticipant = (participant: ParticipantDto) => {
  const kda =
    participant.deaths === 0
      ? "Perfect"
      : (
          (participant.kills + participant.assists) /
          participant.deaths
        ).toFixed(2);

  return (
    <div
      key={participant.puuid}
      className="flex items-center p-2 border-b border-gray-700 last:border-b-0"
    >
      <Image
        src={getChampionIconUrl(participant.championName)}
        alt={participant.championName}
        width={30}
        height={30}
        className="rounded-full "
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/file.svg";
        }}
        unoptimized
      />
      <div className="flex flex-col gap-1 mr-2">
        <Image
          src={getSpellIconUrl(participant.summoner1Id)}
          alt={`Spell ${participant.summoner1Id}`}
          width={13}
          height={13}
          className="rounded-sm ml-1"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/file.svg";
          }}
          unoptimized
        />
        <Image
          src={getSpellIconUrl(participant.summoner2Id)}
          alt={`Spell ${participant.summoner2Id}`}
          width={13}
          height={13}
          className="rounded-sm ml-1"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/file.svg";
          }}
          unoptimized
        />
      </div>
      <div className="flex-grow">
        <p className="font-medium text-sm text-white">
          {participant.summonerName}
        </p>
        <p className="text-xs text-white">
          {participant.riotIdGameName}#{participant.riotIdTagline}
        </p>
      </div>
      <div className="text-xs text-right text-white">
        {/* <p>
          {participant.kills}/{participant.deaths}/{participant.assists} ({kda})
        </p>
        <p>CS: {participant.totalMinionsKilled}</p>
        <p>Gold: {participant.goldEarned.toLocaleString()}</p>
        <p>
          Damage: {participant.totalDamageDealtToChampions.toLocaleString()}
        </p> */}
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
                unoptimized
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default function MatchDetailAccordion({
  matchDetails,
}: MatchDetailAccordionProps) {
  const team1 = matchDetails.participants.filter((p) => p.win);
  const team2 = matchDetails.participants.filter((p) => !p.win);

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <div className="flex flex-col">
        <div className="rounded-lg p-3 ">
          <h3 className="font-bold text-lg mb-2 text-blue-400">승리 팀</h3>
          {team1.map(renderParticipant)}
        </div>
        <div className="rounded-lg p-3 ">
          <h3 className="font-bold text-lg mb-2 text-red-400">패배 팀</h3>
          {team2.map(renderParticipant)}
        </div>
      </div>
    </div>
  );
}
