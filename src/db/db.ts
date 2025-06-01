import Dexie from "dexie";
import type { Table } from "dexie";

export interface Competition {
  id?: number;
  name: string;
  season: number;
  trophy: string;
  competitionType: string;
  format: string;
  startDate: string;
  endDate: string;
  videoLocation: string;
  matchType: string;
  listOfTeams: string[]; // Team names or IDs
  teamsParticipating: string[]; // Team names or IDs
  currentStatus: string;
}

export interface Team {
  id?: number;
  name: string;
  code: string;
  teamType: string;
  logo?: string; // store as base64 string or file URL for MVP
  country: string;
}

export interface Player {
  id?: number;
  name: string;
  playerId: number;
  shortName: string;
  photo?: string;
  dob: string;
  nationality: string;
  battingStyle: string;
  battingOrder: string;
  bowlingStyle: string;
  bowlingType: string;
  bowlingSpecialization: string;
  playerRole: string;
  team: string;
  status: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  overs?: number;
  maidens?: number;
  runsGiven?: number;
  wickets?: number;
  economy?: number;
}

export interface Official {
  id?: number;
  name: string;
  photo?: string;
  role: string;
  nationality: string;
  experience: number;
  category: string;
  state: ""
  status: string;
}

export interface Coach {
  id?: number;
  name: string;
  photo?: string;
  team: string;
  nationality: string;
  role: string;
}

export interface Venue {
  id?: number;
  name: string;
  photo?: string;
  country: string;
  state: string;
  city: string;
  capacity: number;
  groundSize: string;
  homeTeam: string;
}

export interface ShotType {
  id?: number;
  name: string;
  shotType: string; // Aggressive, Defensive
}

export interface BallType {
  id?: number;
  name: string;
  bowlerType: string;
}

export interface BowlerSpecialization {
  id?: number;
  specialization: string;
  bowlingType: string;
  bowlingStyle: string;
}

export interface FieldingFactor {
  id?: number;
  name: string;
}

export interface AppConfig {
  id?: number;
  storageDirHandle?: any; // FileSystemDirectoryHandle (browser)
}

export interface Match {
  id?: number;
  name: string;
  competition: string;
  matchType: string;
  venue: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  umpire1: string;
  umpire2: string;
  umpire3?: string;
  matchReferee?: string;
  innings?: number; // e.g. 2
  overs?: number;
  status?: string;
  storageFolderName?: string; // e.g. "CSK_vs_MI_2024-05-29"
  neutralVenue?: boolean;
  videoLocation?: string;
  matchResult?: string;     // "Win" | "Tie" | "No Result"
  winningTeam?: string;
  manOfMatch?: string;
  powerplay?: string;
  middleOvers?: string;
  deathOvers?: string;
  homeSquad?: string[];
  awaySquad?: string[];
  homePlaying11?: string[];
  awayPlaying11?: string[];
  target?: number;
}

export interface BallEvent {
  id?: number;
  matchId: number;
  innings: number;
  over: number;
  ball: number;
  batsman: string;
  bowler: string;
  runs: number;
  extras: string[];     // ["Wide", "No Ball", ...]
  extraRuns: number;
  wicket: boolean;
  wicketType?: string;
  fielders: string[];
  pitchMark: { row: string; col: string; x: number; y: number };
  wagonWheel: { sector: string; x: number; y: number };
  videoFileName?: string;
  commentary?: string;
  timestamp?: string;
}

export interface User {
  id?: number;
  name: string;
  role: string;
  machineId: string;
  licenseUpto: string;
  loginId: string;
  password: string;
  photo?: string;
}

export class AppDB extends Dexie {
  competitions!: Table<Competition, number>;
  teams!: Table<Team, number>;
  players!: Table<Player, number>;
  officials!: Table<Official, number>;
  coaches!: Table<Coach, number>;
  venues!: Table<Venue, number>;
  shotTypes!: Table<ShotType, number>;
  ballTypes!: Table<BallType, number>;
  bowlerSpecializations!: Table<BowlerSpecialization, number>;
  fieldingFactors!: Table<FieldingFactor, number>;
  appConfigs!: Table<AppConfig, number>;
  matches!: Table<Match, number>;
  ballEvents!: Table<BallEvent, number>;
  users!: Table<User, number>;
  
  constructor() {
    super("CricAnalyticsDB");
    this.version(1).stores({
      competitions: "++id, name, season",
      teams: "++id, name, code",
      players: "++id, name, playerId",
      officials: "++id, name",
      coaches: "++id, name, team",
      venues: "++id, name, city",
      shotTypes: "++id, name",
      ballTypes: "++id, name",
      bowlerSpecializations: "++id, specialization",
      fieldingFactors: "++id, name",
      appConfigs: "++id, storageDirHandle",
      matches: "++id, name",
      ballEvents: "++id, matchId, innings, over, ball",
      users: "++id, name, role, machineId, licenseUpto, loginId, password"
    });
  }
}

export const db = new AppDB();
