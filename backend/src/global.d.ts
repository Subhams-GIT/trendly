declare global {
  namespace Express {
    interface Request {
      user?:JWTPayload
    }
  }
}

export type JWTPayload = {
    id: string,
    name: string,
    email: string,
}
