import * as jwt from 'jsonwebtoken'
import * as http from 'http';

export default function authenticate(req: http.IncomingMessage) {
    const auth = req.headers.authorization;
    if (!auth) throw new Error("unauthorized");
    const token = auth.split(" ")[1];
    if (token) return JSON.stringify(jwt.verify(token, process.env.JWT_SECRET!));
}
