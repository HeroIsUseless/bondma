import { atom } from "jotai";

export type Team = {
    name: string,
    id: number,    
    members: string[]
}

export const nowTeam = atom<Team>({
    name: "",
    id: 0,
    members: []
});

export const teams = atom<Team[]>([])

export type Project = {
    name: string,
    id: number,
}

export const nowProject = atom<Project>({
    name: "",
    id: 0,
});

export const projects = atom<Project[]>([])
