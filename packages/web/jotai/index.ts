import { atom } from "jotai";
import { Project, Team, User } from "./types";

export const nowTeamAtom = atom<Team | null>(null);

export const teamsAtom = atom<Team[]>([]);

export const nowProjectAtom = atom<Project | null>(null);

export const projectsAtom = atom<Project[]>([]);
