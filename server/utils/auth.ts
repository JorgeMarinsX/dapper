import bcrypt from 'bcrypt'
import { SignJWT, jwtVerify } from 'jose'
import type { H3Event } from 'h3'

const SALT_ROUNDS = 10
const COOKIE_NAME = 'dapper_token'
const TOKEN_EXPIRY = '7d'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is not set')
  return new TextEncoder().encode(secret)
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export async function signToken(barbeariaId: string): Promise<string> {
  return new SignJWT({ barbeariaId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<{ barbeariaId: string }> {
  const { payload } = await jwtVerify(token, getSecret())
  return { barbeariaId: payload.barbeariaId as string }
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export function getAuthCookie(event: H3Event): string | undefined {
  return getCookie(event, COOKIE_NAME)
}
