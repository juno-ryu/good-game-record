import Image from "next/image";

// This interface should eventually be moved to a central types file.
export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
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
        <h2 className="text-2xl font-bold">{summonerData.name}</h2>
        <p className="text-lg text-gray-400">
          Level {summonerData.summonerLevel}
        </p>
      </div>
    </div>
  );
}
