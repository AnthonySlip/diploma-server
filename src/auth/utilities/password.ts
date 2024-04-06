import * as bcrypt from 'bcryptjs'

export const hash = async (password: string) => {
    return bcrypt.hash(password, 10)
}

export const compare = async (plain: string, hash: string) => {
    return bcrypt.compare(plain, hash)
}