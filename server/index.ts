import "dotenv/config";                      // read the .env file and load its secrets (must be first!)
import express from "express";               // the server tool
import cors from "cors";                     // the permission note (CORS)
import mongoose from "mongoose";             // the database assistant
import ticketRoutes from "./routes/tickets"; // your ticket routes (from routes/tickets)
import authRoutes from "./routes/auth";      // the login/sign-up routes

const app = express();                       // create the app. "app" is the server
const PORT = process.env.PORT || 3000;       // use PORT from .env, or 3000 if it's missing

app.use(cors());                             // permission note: let the web page talk to this server
app.use(express.json());                     // middleware: open JSON envelopes before the routes get them
app.use("/api/tickets", ticketRoutes);       // send every /api/tickets request to the ticket routes
app.use("/api/auth", authRoutes);            // send every /api/auth request to the login/sign-up routes

// Health check: is the server running?
app.get("/", function (req, res) {
    res.send("API is running");
});

// Connect to the database, THEN start the server
async function startServer() {                          // async = this function can wait
    const uri = process.env.MONGODB_URI;                // ✨ NEW: get the secret database address

    if (!uri) {                                         // ✨ NEW: is it missing?
        console.log("MONGODB_URI is missing in .env ❌"); //   say so clearly
        return;                                         //   stop, don't try to connect
    }

    try {                                               // try = "attempt this..."
        await mongoose.connect(uri);                    // connect using the address, and wait
        console.log("MongoDB connected ✅");            // connection worked!

        app.listen(PORT, function () {                  // now open the doors
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {                                   // catch = "...if anything goes wrong, do this"
        console.log("MongoDB connection failed ❌");
        console.log(error instanceof Error ? error.message : "Unknown error"); // ✨ NEW: only use .message if it's a real Error
    }
}

startServer(); // run it!