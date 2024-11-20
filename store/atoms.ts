import { atom } from "jotai";
import { Project, Team, User } from "./types";

export const userAtom = atom<User>({
    name: "xxxx",
    id: 0,
});

export const nowTeamAtom = atom<Team>({
    name: "xxxteam",
    id: 0,
    members: []
});

export const teamsAtom = atom<Team[]>([])

export const nowProjectAtom = atom<Project | null>({
    name: "xxxproject",
    id: 10,
    defaultLang: "en",
    teamId: 0,
    members: ['xxx', 'yyy'],
    tokens: [
        {
          id: '1',
          key: 'hello',
          translations: [
            { lang: 'en', text: 'Hello' },
            { lang: 'es', text: 'Hola' }
          ],
        },
        {
          id: '2',
          key: 'world',
          translations: [
            { lang: 'en', text: 'World' },
            { lang: 'es', text: 'Mundo' }
          ],
        }
      ],
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
