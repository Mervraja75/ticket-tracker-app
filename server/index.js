require("dotenv").config(); // read the .env file and load its secrets
const express = require("express") // bring in Express
const ticketRoutes = require("./routes/tickets");
const cors = require("cors");
const moongose = require("mongoose"); // the helper that talks to MongoDB
const app = express(); // create the app. "app" is the server
app.use(cors()); //permission note
app.use(express.json()); //middleware : code that runs on every request before the routes
app.use("/api/tickets", ticketRoutes);
const PORT = process.env.PORT || 3000; // the server "app" will listen to the port 3000
app.get("/", function (req, res) {
    res.send("API is running");
})

//connect to the database and start the server
async function startServer() { // async = this function can wait
    try { // try = "attempt this..."
        await moongose.connect(process.env.MONGODB_URI); // connect using the secret address, and wait
        console.log("MongoDB connected ✅")  // Connection worked!

        app.listen(PORT, function() { // now open the doors
            console.log(`Server running on http://localhost:${PORT}`);
        }); 
    }catch (error) { // catch = "...if anything goes wrong, do this"
        console.log("MongoDB connection failed ❌");
        console.log(error.message); // show what went wrong
    }
}

startServer();