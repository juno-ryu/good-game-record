import {
  getChampionIconUrl,
  getItemIconUrl,
  getSpellIconUrl,
} from "@/shared/utils/helpers/ddragon-urls";
import {
  calculateFinalScore,
  getRankLabelProps,
} from "@/shared/utils/helpers/helper";
import { ParticipantDto } from "@/shared/utils/types/participan-dto";
import { Line } from "rc-progress";
import Image from "next/image";
import * as Label from "@radix-ui/react-label";

interface PlayerStatsRowProps {
  participant: ParticipantDto;
  maxDamage: number;
  rank: number;
  isAce: boolean;
}

export default function PlayerStatsRow({
  participant,
  maxDamage,
  rank,
  isAce,
}: PlayerStatsRowProps) {
  const kdaRatio =
    (participant.kills + participant.assists) /
    (participant.deaths === 0 ? 1 : participant.deaths);
  const finalScore = calculateFinalScore(
    kdaRatio,
    participant.totalDamageDealtToChampions,
    maxDamage
  );

  const kda = kdaRatio.toFixed(2);

  const damagePercentage =
    (participant.totalDamageDealtToChampions / maxDamage) * 100;

  const csPerMinute = (
    (participant.totalMinionsKilled + participant.neutralMinionsKilled) /
    (participant.timePlayed / 60)
  ).toFixed(1);

  const rankLabelProps = getRankLabelProps(rank, isAce);

  return (
    <div className="grid grid-cols-10 items-center text-xs text-white px-2 py-1 border-t border-gray-700">
      {/* Player Info */}
      <div className="col-span-3 flex items-center justify-between gap-2">
        <Image
          src={getChampionIconUrl(participant.championName)}
          alt={participant.championName}
          width={32}
          height={32}
          className="rounded-md"
        />
        <div className="flex flex-col gap-0.5">
          <Image
            src={getSpellIconUrl(participant.summoner1Id)}
            alt="Summoner Spell 1"
            width={16}
            height={16}
            className="rounded-sm"
          />
          <Image
            src={getSpellIconUrl(participant.summoner2Id)}
            alt="Summoner Spell 2"
            width={16}
            height={16}
            className="rounded-sm"
          />
        </div>
        <div className="mr-auto">
          <p className="font-semibold">{participant.riotIdGameName}</p>
          <p className="text-gray-400">Level {participant.champLevel}</p>
        </div>
        {rankLabelProps && (
          <Label.Root
            className={`${rankLabelProps.bgColor} flex justify-center items-center rounded-lg px-2 text-xs font-bold mr-3`}
          >
            {rankLabelProps.text}
          </Label.Root>
        )}
      </div>

      {/* KDA */}
      <div className="col-span-1">
        <p className="font-semibold text-blue-300">
          {participant.kills} / {participant.deaths} / {participant.assists}
        </p>
        <p className="text-gray-400">{kda}:1</p>
      </div>

      {/* Wards */}
      <div className="col-span-1">
        <p>
          {participant.wardsPlaced} / {participant.wardsKilled}
        </p>
      </div>

      {/* CS */}
      <div className="col-span-1">
        <p>
          {participant.totalMinionsKilled + participant.neutralMinionsKilled}
        </p>
        <p className="text-gray-400">({csPerMinute})</p>
      </div>

      {/* Damage */}
      <div className="col-span-1 flex flex-col gap-1">
        <p className="text-xs">
          {participant.totalDamageDealtToChampions.toLocaleString()}
        </p>
        <Line
          percent={damagePercentage}
          strokeWidth={7}
          strokeColor="#D43F3A"
          trailWidth={7}
          trailColor="#293646"
        />
      </div>

      {/* Items */}
      <div className="col-span-3 flex justify-end gap-1">
        {[...Array(6)].map((_, i) => {
          const item = participant[
            `item${i}` as keyof ParticipantDto
          ] as number;
          return item > 0 ? (
            <Image
              key={i}
              src={getItemIconUrl(item)}
              alt={`Item ${item}`}
              width={22}
              height={22}
              className="rounded-sm"
            />
          ) : (
            <div
              key={i}
              className="w-[22px] h-[22px] bg-gray-700/50 rounded-sm"
            ></div>
          );
        })}
        <Image
          src={getItemIconUrl(participant.item6)}
          alt={`Item ${participant.item6}`}
          width={22}
          height={22}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
