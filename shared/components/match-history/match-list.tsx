"use client";

import { useEffect } from "react";
import { useMatchStore } from "@/shared/store/match-store";
import MatchCard from "./match-card";
import * as Accordion from "@radix-ui/react-accordion";

interface MatchListProps {
  puuid: string;
}

export default function MatchList({ puuid }: MatchListProps) {
  const { matches, isLoading, error, fetchMatches } = useMatchStore();

  useEffect(() => {
    if (puuid) {
      fetchMatches(puuid);
    }
  }, [puuid, fetchMatches]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">매치 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>매치 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
        <p className="text-sm mt-2">에러: {error}</p>
      </div>
    );
  }

  if (matches.length === 0 && !isLoading && !error) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>최근 매치 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <Accordion.Root type="single" collapsible className="w-full">
      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.gameId} match={match} puuid={puuid} />
        ))}
      </div>
    </Accordion.Root>
  );
}
