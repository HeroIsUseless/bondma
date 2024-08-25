export type User = {
    id: number,
    name: string,
}

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

export type Token = {
    id: string,
    key: string,
    translations: Translation[],
}

export type Translation = {
    lang: string,
    text: string,
}
