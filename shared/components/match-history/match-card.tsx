// shared/components/match-history/match-card.tsx
'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko'; // Import Korean locale

dayjs.extend(relativeTime);
dayjs.locale('ko'); // Use Korean locale

interface MatchCardProps {
  match: {
    matchId: string;
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp: number;
    win: boolean;
    championName: string;
    kills: number;
    deaths: number;
    assists: number;
    teamPosition: string;
    // Add other necessary fields for display
  };
  onCardClick: (matchId: string) => void;
}

export default function MatchCard({ match, onCardClick }: MatchCardProps) {
  const {
    matchId,
    gameCreation,
    gameDuration,
    win,
    championName,
    kills,
    deaths,
    assists,
    teamPosition,
  } = match;

  const kda = deaths === 0 ? (kills + assists).toFixed(2) : ((kills + assists) / deaths).toFixed(2);

  // Format game duration
  const minutes = Math.floor(gameDuration / 60);
  const seconds = gameDuration % 60;
  const formattedDuration = `${minutes}분 ${seconds}초`;

  // Format game date
  const gameDate = dayjs(gameCreation).fromNow();

  return (
    <div
      className={`flex items-center p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-gray-800`} // 기본 배경색을 gray-800으로 설정
      onClick={() => onCardClick(matchId)}
    >
      <div className="w-16 h-16 flex-shrink-0 mr-4 relative">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`}
          alt={championName}
          className="w-full h-full rounded-full object-cover border-2 border-gray-600"
          onError={(e) => {
            e.currentTarget.onerror = null; // prevents looping
            e.currentTarget.src = '/file.svg'; // Fallback image
          }}
        />
      </div>

      <div className="flex-grow text-white">
        <div className="flex justify-between items-center mb-1">
          <span className={`font-bold text-lg ${win ? 'text-blue-400' : 'text-red-400'}`}>{win ? '승리' : '패배'}</span>
          <span className="text-sm text-gray-300">{gameDate}</span>
        </div>
        <p className="text-md">
          {championName} ({teamPosition})
        </p>
        <p className="text-sm text-gray-300">
          KDA: {kills}/{deaths}/{assists} ({kda}:1)
        </p>
        <p className="text-sm text-gray-300">게임 시간: {formattedDuration}</p>
      </div>
    </div>
  );
}
