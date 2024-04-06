import {IAccessToken} from './token-pair.interface';

export interface ILoginResponse {
    accessToken: IAccessToken
    user: {
        id: number
        email: string
        firstName: string
        lastName: string
    }
}
