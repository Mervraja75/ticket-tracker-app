import { Request, Response, NextFunction } from "express"; // labels for the request, the response, and "go ahead"
import jwt from "jsonwebtoken";                             // the keycard machine 

// 💂 The guard: only lets people in if they show a real keycard
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;               // look for the keycard header

    // 1. No keycard at all? (or it doesn't start with "Bearer ")
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ error: "Please log in first" }); // 401 = not allowed in
        return;                                             // stop here
    }

    const token = header.slice(7);                          // cut off "Bearer " (7 letters) to get just the card

    // 2. Get the secret stamp
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ error: "Server is missing JWT_SECRET" }); // the server's problem
        return;                                             // stop here
    }

    try {
        // 3. Check the card: is the stamp real? is it expired?
        const payload = jwt.verify(token, secret) as { userId: string; role: string }; // read what's written on the card

        res.locals.user = payload;                          // remember WHO this is, so the route can use it
        next();                                             // ✅ "go ahead!" → on to the route
    } catch (error) {
        res.status(401).json({ error: "Your login is invalid or expired. Please log in again." }); // ❌ fake or expired card
    }
}