
export interface ITokenPair {
    accessToken: IAccessToken
    refreshToken: string
}

export interface IAccessToken {
    expiresIn: string
    token: string
}