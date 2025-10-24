import Image from "next/image";
import { Star } from "lucide-react";

// This interface should eventually be moved to a central types file.
export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  tagLine: string;
}

interface SummonerProfileProps {
  summonerData: SummonerData;
}

const DDRAGON_VERSION = "15.20.1";

export function SummonerProfile({ summonerData }: SummonerProfileProps) {
  const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${summonerData.profileIconId}.png`;
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg w-full">
      <Image
        src={profileIconUrl}
        alt={`${summonerData.name} profile icon`}
        width={64}
        height={64}
        className="rounded-full border-2 border-blue-500"
      />

      <div>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className="text-xl font-bold ">{summonerData.name}</h3>
          <h3 className="text-xl font-bold">#{summonerData.tagLine}</h3>
        </div>
        <p className="text-md text-gray-400">
          Level {summonerData.summonerLevel}
        </p>
      </div>
    </div>
  );
}
