// shared/components/match-history/match-summary.tsx
'use client';

import { useMatchStore } from '@/shared/store/match-store';

export default function MatchSummary() {
  const { summary, isLoading, error } = useMatchStore();

  if (isLoading) {
    return <div className="text-center py-4">Loading summary...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (!summary) {
    return null; // Or a placeholder if no summary is available yet
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white mb-4">
      <h2 className="text-xl font-bold mb-2">최근 경기 요약</h2>
      <p className="text-lg">
        총 {summary.totalMatches}경기 중 {summary.wins}승 {summary.losses}패 (승률: {summary.winRate})
      </p>
      <p className="text-lg">평균 KDA: {summary.averageKDA}</p>
    </div>
  );
}
