"use client";

import { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";
import { Search, Loader2, X, Gamepad } from "lucide-react";
import {
  SummonerProfile,
  SummonerData,
} from "@/shared/components/summoner-profile";
import MatchList from "@/shared/components/match-history/match-list";
import ChampionSummary from "@/shared/components/match-history/champion-summary";
import MatchSummary from "@/shared/components/match-history/match-summary";
import { useSummonerStore, RecentSearch } from "@/shared/store/summoner-store";

export default function Home() {
  const {
    riotId,
    setRiotId,
    summonerData,
    setSummonerData,
    isLoading,
    setIsLoading,
    error,
    setError,
    recentSearches,
    addRecentSearch,
    loadRecentSearches,
  } = useSummonerStore();

  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  const handleSearch = async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    setSummonerData(null);
    setIsInputFocused(false);

    try {
      const response = await fetch(`/api/account/${encodeURIComponent(id)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      const data: SummonerData = await response.json();
      setSummonerData(data);
      addRecentSearch(id, data.profileIconId); // profileIconId 추가
      console.log("API Response:", data);
    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(riotId);
  };

  const handleRecentSearchClick = (searchItem: RecentSearch) => {
    setRiotId(searchItem.riotId);
    handleSearch(searchItem.riotId);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-900 text-white">
      <div className="w-full max-w-6xl space-y-4">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2 mx-auto">
          <Gamepad size={36} /> GGR
        </h1>
        <Form.Root
          onSubmit={handleSubmit}
          className={`relative ${summonerData ? "w-full" : "max-w-lg mx-auto"}`}
        >
          <Form.Field name="riotId">
            <div className="relative">
              <Form.Control asChild>
                <input
                  type="text"
                  value={riotId || ""} // undefined 방지
                  onChange={(e) => setRiotId(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setTimeout(() => setIsInputFocused(false), 150)} // Delay to allow click on recent search
                  placeholder="Riot ID (GameName#TagLine)"
                  className="w-full p-4 pr-12 text-lg bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                  required
                  autoComplete="off"
                />
              </Form.Control>
              <Form.Submit asChild>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Search size={24} />
                  )}
                </button>
              </Form.Submit>
            </div>
          </Form.Field>
          {isInputFocused && recentSearches.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg z-10">
              <ul>
                {recentSearches.map((searchItem, index) => (
                  <li
                    key={index}
                    onClick={() => handleRecentSearchClick(searchItem)}
                    className="flex items-center p-3 hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${searchItem.profileIconId}.png`}
                      alt="Profile Icon"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    {searchItem.riotId}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Form.Root>

        {error && (
          <div className="text-red-500 text-center p-2 bg-red-900/50 rounded-lg">
            {error}
          </div>
        )}

        {summonerData && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="w-full md:w-3/10 space-y-4">
              <SummonerProfile summonerData={summonerData} />
              {summonerData?.puuid && <MatchSummary />}
              {summonerData?.puuid && <ChampionSummary />}
            </div>
            <div className="w-full md:w-7/10">
              {summonerData?.puuid && <MatchList puuid={summonerData.puuid} />}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
