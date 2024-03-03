import jwt, { JwtPayload } from 'jsonwebtoken'
const JWT_SECRET: string = process.env.JWT_SECRET || 'secret'
const JWT_EXPIRES_IN = '2h'
interface EncodePayload {
  email: string
}
export function encode(payload: EncodePayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}
export function decode(token: string) {
  let payload: JwtPayload | string | undefined
  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      throw { type: 'unauthorized', message: 'Invalid token' }
    }
    payload = decoded
  })
  return payload
}
export function authorize(authorization: string) {
  const token: string = authorization?.replace('Bearer ', '')
  if (!token) {
    return false
  }
  const decoded = decode(token)
  if (decoded === undefined) {
    return false
  }
  return decoded
}
