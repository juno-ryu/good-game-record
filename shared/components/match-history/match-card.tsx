"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import * as Accordion from "@radix-ui/react-accordion";
import MatchDetailAccordion from "./match-detail-accordion";
import { MatchDto } from "@/shared/utils/types/match-dto";
import { ParticipantDto } from "@/shared/utils/types/participan-dto";
import Image from "next/image";
import {
  getChampionIconUrl,
  getItemIconUrl,
  getSpellIconUrl,
} from "@/shared/utils/helpers/ddragon-urls";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface MatchCardProps {
  match: MatchDto;
  puuid: string;
}

export default function MatchCard({ match, puuid }: MatchCardProps) {
  const { gameId, gameCreation, gameDuration, gameMode } = match;

  const participant: ParticipantDto | undefined = match.participants.find(
    (p) => p.puuid === puuid
  );

  if (!participant) {
    return null; // Or a loading/error state
  }

  const kda =
    participant.deaths === 0
      ? "Perfect"
      : (
          (participant.kills + participant.assists) /
          participant.deaths
        ).toFixed(2);
  const minutes = gameDuration / 60;
  const csPerMinute = (
    (participant.totalMinionsKilled + participant.neutralMinionsKilled) /
    minutes
  ).toFixed(1);

  const team1 = match.participants.filter((p) => p.teamId === 100);
  const team2 = match.participants.filter((p) => p.teamId === 200);

  const gameDate = dayjs(gameCreation).fromNow();
  const formattedDuration = `${Math.floor(minutes)}분 ${Math.floor(
    gameDuration % 60
  )}초`;

  return (
    <Accordion.Item value={gameId.toString()} className="border-gray-700">
      <Accordion.Trigger className="w-full">
        <div className="relative rounded-lg shadow-md transition-all duration-200 bg-gray-800 hover:bg-gray-700 overflow-hidden">
          <div
            className={`${
              participant.win ? "bg-blue-400" : "bg-red-400"
            } absolute w-[5px] h-full`}
          />
          <div className="grid grid-cols-12 gap-2 items-center text-white text-xs p-4">
            {/* Left Column */}
            <div className="col-span-2 flex flex-col justify-between items-start h-[60%]">
              <p
                className={`font-bold ${
                  participant.win ? "text-blue-400" : "text-red-400"
                }`}
              >
                {participant.win ? "승리" : "패배"}
              </p>
              <p className="mb-auto">{gameDate}</p>
              <p>{formattedDuration}</p>
              <p className="text-gray-400">{gameMode}</p>
            </div>

            {/* Middle Column 1 (Player) */}
            <div className="col-span-3 flex flex-col">
              <div className="flex items-start gap-1">
                <Image
                  src={getChampionIconUrl(participant.championName)}
                  alt={participant.championName}
                  width={48}
                  height={48}
                  className="rounded-md"
                  unoptimized
                />
                <div className="flex flex-col gap-1 justify-between">
                  <Image
                    src={getSpellIconUrl(participant.summoner1Id)}
                    alt="Spell 1"
                    width={20}
                    height={20}
                    className="rounded-sm"
                    unoptimized
                  />
                  <Image
                    src={getSpellIconUrl(participant.summoner2Id)}
                    alt="Spell 2"
                    width={20}
                    height={20}
                    className="rounded-sm"
                    unoptimized
                  />
                </div>
                {/* Rune placeholders */}
                <div className="flex flex-col gap-1 justify-between">
                  <div className="w-[20px] h-[20px] bg-gray-600 rounded-full"></div>
                  <div className="w-[20px] h-[20px] bg-gray-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="w-[20px] h-[20px] bg-gray-600 rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-0.5 mt-2">
                {[...Array(6)].map((_, i) => {
                  const item = participant[
                    `item${i}` as keyof ParticipantDto
                  ] as number;
                  return item > 0 ? (
                    <Image
                      key={i}
                      src={getItemIconUrl(item)}
                      alt={`Item ${item}`}
                      width={20}
                      height={20}
                      className="rounded-sm h-[20px] w-[20px]"
                      unoptimized
                    />
                  ) : (
                    <div
                      key={i}
                      className="w-[20px] h-[20px] bg-gray-700/50 rounded-sm"
                    ></div>
                  );
                })}
                {/* Trinket placeholder */}
              </div>
            </div>

            {/* Middle Column 2 (Stats) */}
            <div className="col-span-2 text-left flex flex-col gap-1">
              <p className="font-bold text-sm">
                {participant.kills} / {participant.deaths} /
                {participant.assists}
              </p>
              <p className="text-sm font-bold">{kda} KDA</p>
              <p>
                킬관여:
                {Math.round(participant.challenges.killParticipation * 100)}%
              </p>
              <p>
                CS:
                {participant.totalMinionsKilled +
                  participant.neutralMinionsKilled}
                ({csPerMinute})
              </p>
              <p>
                와드: {participant.wardsPlaced} / {participant.wardsKilled}
              </p>
            </div>

            {/* Right Column (Teams) */}
            <div className="col-span-5 flex justify-end gap-4">
              <div className="flex flex-col space-y-1">
                {team1.map((p) => {
                  console.log(p);
                  return (
                    <div key={p.puuid} className="flex items-center">
                      <Image
                        src={getChampionIconUrl(p.championName)}
                        alt={p.championName}
                        width={16}
                        height={16}
                        className="rounded-sm"
                        unoptimized
                      />
                      <p className="ml-1 text-left truncate w-20">
                        {p.riotIdGameName}#{p.riotIdTagline}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col space-y-1">
                {team2.map((p) => (
                  <div key={p.puuid} className="flex items-center ">
                    <Image
                      src={getChampionIconUrl(p.championName)}
                      alt={p.championName}
                      width={16}
                      height={16}
                      className="rounded-sm"
                      unoptimized
                    />
                    <p className="ml-1 text-left truncate w-20">
                      {p.riotIdGameName}#{p.riotIdTagline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Accordion.Trigger>
      <Accordion.Content>
        <MatchDetailAccordion matchDetails={match} />
      </Accordion.Content>
    </Accordion.Item>
  );
}
