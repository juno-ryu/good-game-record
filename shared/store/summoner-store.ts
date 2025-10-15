import { create } from "zustand";
import type { SummonerData } from "@/shared/components/summoner-profile";

export interface RecentSearch {
  riotId: string;
  profileIconId: number;
}

interface SummonerState {
  riotId: string;
  setRiotId: (id: string) => void;
  summonerData: SummonerData | null;
  setSummonerData: (data: SummonerData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  recentSearches: RecentSearch[]; // 타입 변경
  addRecentSearch: (id: string, profileIconId: number) => void; // 시그니처 변경
  loadRecentSearches: () => void;
  clearRecentSearches: () => void;
}

export const useSummonerStore = create<SummonerState>((set, get) => ({
  riotId: "",
  setRiotId: (id) => set({ riotId: id }),
  summonerData: null,
  setSummonerData: (data) => set({ summonerData: data }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error: error }),
  recentSearches: [],
  addRecentSearch: (id, profileIconId) => {
    if (typeof window !== "undefined") {
      const { recentSearches } = get();
      const newSearch: RecentSearch = {
        riotId: id.toLowerCase(),
        profileIconId,
      };
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter(
          (search) => search.riotId.toLowerCase() !== newSearch.riotId
        ),
      ].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      set({ recentSearches: updatedSearches });
    }
  },
  loadRecentSearches: () => {
    if (typeof window !== "undefined") {
      const storedSearches = localStorage.getItem("recentSearches");
      if (storedSearches) {
        set({ recentSearches: JSON.parse(storedSearches) as RecentSearch[] }); // 타입 캐스팅 추가
      }
    }
  },
  clearRecentSearches: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentSearches");
      set({ recentSearches: [] });
    }
  },
}));
