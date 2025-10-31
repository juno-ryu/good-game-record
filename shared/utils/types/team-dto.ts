export type TeamDto = {
  bans: Ban[];
  feats: Feats;
  objectives: Objectives;
  teamId: number;
  win: boolean;
};

interface Objectives {
  atakhan: Atakhan;
  baron: Atakhan;
  champion: Atakhan;
  dragon: Atakhan;
  horde: Atakhan;
  inhibitor: Atakhan;
  riftHerald: Atakhan;
  tower: Atakhan;
}

interface Atakhan {
  first: boolean;
  kills: number;
}

interface Feats {
  EPIC_MONSTER_KILL: EPICMONSTERKILL;
  FIRST_BLOOD: EPICMONSTERKILL;
  FIRST_TURRET: EPICMONSTERKILL;
}

interface EPICMONSTERKILL {
  featState: number;
}

interface Ban {
  championId: number;
  pickTurn: number;
}
