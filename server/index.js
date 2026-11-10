require("dotenv").config(); // read the .env file and load its secrets

const express = require("express") // bring in Express
const ticketRoutes = require("./routes/tickets");
const cors = require("cors");
const app = express(); // create the app. "app" is the server
app.use(cors()); //permission note
app.use(express.json()); //middleware : code that runs on every request before the routes
app.use("/api/tickets", ticketRoutes);
const PORT = process.env.PORT || 3000; // the server "app" will listen to the port 3000
console.log(process.env.MONGODB_URI ? "Database address found" : "Database address missing"); // Check the database address loaded (don't print the address itself!)

app.get("/", function (req, res) {
    res.send("API is running");
})

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
})