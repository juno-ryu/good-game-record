'use client'

export const DDRAGON_VERSION = "14.10.1";

export const getChampionIconUrl = (championName: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championName}.png`;

export const getItemIconUrl = (itemId: number) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`;

export const getSpellName = (spellId: number) => {
  switch (spellId) {
    case 21:
      return "SummonerBarrier";
    case 1:
      return "SummonerBoost";
    case 14:
      return "SummonerDot";
    case 3:
      return "SummonerExhaust";
    case 4:
      return "SummonerFlash";
    case 6:
      return "SummonerHaste";
    case 7:
      return "SummonerHeal";
    case 13:
      return "SummonerMana";
    case 11:
      return "SummonerSmite";
    case 12:
      return "SummonerTeleport";
    case 32:
      return "SummonerSnowball";
    case 39:
      return "SummonerClairvoyance";
    default:
      return "SummonerFlash";
  }
};

export const getSpellIconUrl = (spellId: number) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${getSpellName(
    spellId
  )}.png`;
