import express, { Request, Response } from "express"; // the server tool + Request/Response labels
import bcrypt from "bcryptjs";                         // the password blender 
import User from "../models/User";                     // the User assistant

const router = express.Router();                       // the mini app for login/sign-up routes

// REGISTER: create a new account
router.post("/register", async function (req: Request, res: Response) {
    const name = req.body?.name;           // the name they typed
    const email = req.body?.email;         // the email they typed
    const password = req.body?.password;   // the REAL password they typed (we will NOT save this!)

    // 1. Check that everything is filled in
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" }); // 400, and stop
    }

    // 2. Check the password is long enough
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" }); // 400, and stop
    }

    try {
        // 3. Is this email already taken?
        const existingUser = await User.findOne({ email: email.toLowerCase() }); // look for a user with this email
        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered" }); // 409 = conflict, and stop
        }

        // 4. Blend the password 
        const hashedPassword = await bcrypt.hash(password, 10); // scramble it (10 = how hard to blend)

        // 5. Save the new user, with the BLENDED password
        const newUser = await User.create({
            name: name,                    // their name
            email: email,                  // their email
            password: hashedPassword,      // ✨ the smoothie, NOT the real password
        });

        // 6. Send back the new user, but NEVER the password (not even the blended one!)
        res.status(201).json({
            _id: newUser._id,              // their new id
            name: newUser.name,            // their name
            email: newUser.email,          // their email
            role: newUser.role,            // their role ("requester")
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" }); // 500 = the server's problem
    }
});

export default router; // share this router with index.ts