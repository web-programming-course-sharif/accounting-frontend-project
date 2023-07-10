export const tokenKey = 'token'

export function setToken(t: string) {
    localStorage.setItem(tokenKey, t)
}

export function getToken() {
    return localStorage.getItem(tokenKey)
}