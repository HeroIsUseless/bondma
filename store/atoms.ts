import { atom } from "jotai";
import { Team, User } from "./types";

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

export type Project = {
    name: string,
    id: number,
}

export const nowProjectAtom = atom<Project>({
    name: "myproject",
    id: 10,
});

export const projectsAtom = atom<Project[]>([{
    name: "Project 1",
    id: 0,
}, {
    name: "Project 2",
    id: 1,
}])
