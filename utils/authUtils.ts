import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config({ path: './.env' })

const secret = process.env.TOKEN_SECRET


export function generateAccessToken(username: string) {
    if (!secret) throw ("Error: TOKEN_SECRET not found")
    return jwt.sign(username, secret);
}