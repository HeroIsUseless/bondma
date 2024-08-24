import { atom } from "jotai";
import { Team } from "./types";

export const nowTeamAtom = atom<Team>({
    name: "",
    id: 0,
    members: []
});

export const teamsAtom = atom<Team[]>([])

export type Project = {
    name: string,
    id: number,
}

export const nowProjectAtom = atom<Project>({
    name: "",
    id: 0,
});

export const projectsAtom = atom<Project[]>([{
    name: "Project 1",
    id: 0,
}, {
    name: "Project 2",
    id: 1,
}])
