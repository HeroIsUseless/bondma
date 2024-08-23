export function post<T, P>(api: string, data: T): Promise<P> {
    return new Promise<P>((resolve, reject) => {
        resolve({} as P);
    });
}

// export function get<T>(api: string): Promise<T> {
//     return new Promise<T>((resolve, reject) => {
//         resolve({}
// } as T);
