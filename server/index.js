const express = require("express") // bring in Express
const app = express(); // create the app. "app" is the server
const PORT = 3000; // the server "app" will listen to the port 3000

app.get("/", function (req, res) {
    res.send("API is running");
})

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
})