import { atom } from "jotai";
import { Project, Team, User } from "./types";

export const userAtom = atom<User>({
    name: "mike",
    id: 0,
});

export const nowTeamAtom = atom<Team>({
    name: "miketeam",
    id: 0,
    members: []
});

export const teamsAtom = atom<Team[]>([])

export const nowProjectAtom = atom<Project | undefined>({
    name: "myproject",
    id: 10,
    defaultLang: "en",
    tokens: [],
    teamId: 0,
    members: []
});

export const projectsAtom = atom<Project[]>([{
    name: "Project 1",
    id: 0,
    defaultLang: "en",
    tokens: [],
    teamId: 0,
    members: []
}, {
    name: "Project 2",
    id: 1,
    defaultLang: "en",
    tokens: [],
    teamId: 0,
    members: []
}])
