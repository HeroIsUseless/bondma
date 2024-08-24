
export type Team = {
    id: number,    
    name: string,
    members: string[]
}

export type Project = {
    id: number,
    name: string,
    defaultLang: string,
    tokens: Token[],
    teamId: number,
    members: string[]
}

export type User = {
    name: string,
    id: number,
}

export type Translation = {
    id: string,
    key: string,
    tokens: Token[],
}

export type Token = {
    lang: string,
    text: string,
}
