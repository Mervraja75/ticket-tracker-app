const express = require("express") // bring in Express
const app = express(); // create the app. "app" is the server
app.use(express.json()); //middleware : code that runs on every request before the routes
const PORT = 3000; // the server "app" will listen to the port 3000

// Sample Tickets (used first time when the app opens)
let tickets = [ 
    { 
        id: 1, 
        title: "Printer Not Working", 
        description: "My printer is not printing my document from my Gmail.", 
        priority: "high", 
        status: "open", 
        createdAt: "2026-10-15"},

    { 
        id: 2, 
        title: "Wi-Fi Not Working", 
        description: "My phone and laptop are not able to connect to the Wi-Fi.", 
        priority: "medium", 
        status: "in-progress", 
        createdAt: "2026-10-15"},

    { 
        id: 3, 
        title: "Password not Working", 
        description: "My password is not working when I tried to log in.", 
        priority: "low", 
        status: "closed", 
        createdAt: "2026-10-14"},
    {
        id: 4, 
        title: "Monitor not turning on",
        description: "My monitor is not turning on when I plug in.",
        priority: "medium",
        status: "open",
        createdAt: "2026-10-19"},
];

app.get("/", function (req, res) {
    res.send("API is running");
})

app.get("/api/tickets", function (req, res) {
    res.json(tickets)
})

//POST route
app.post("/api/tickets", function (req, res) {
    const newTicket = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        category: req.body.category,
        status: "open",
        createdAt: new Date().toISOString().slice(0, 10),
    };
    tickets.push(newTicket);
    res.status(201).json(newTicket);

});

//Route 1: GET one ticket
app.get("/api/tickets/:id", function(req, res) {
    const id = Number(req.params.id);
    const ticket = tickets.find(function (t) {
        return t.id === id;
    })
    if (!ticket){
        return res.status(404).json({ error: "Ticket not found" });
    }
        res.json(ticket);
    
});

//Route 2: PATCH (update a ticket)
app.patch("/api/tickets/:id", function(req, res) {
    const id = Number(req.params.id);
    const ticket = tickets.find(function (t) {
        return t.id === id;
    });
    if (!ticket){
        return res.status(404).json({ error: "Ticket not found" });
    }
    ticket.status = req.body.status;
    res.json(ticket);
});

//Route 3: DELETE (remove ticket)
app.delete("/api/tickets/:id", function(req, res) {
    const id = Number(req.params.id);
    const ticket = tickets.find(function (t) {
        return t.id === id;
    });
    if (!ticket){
        return res.status(404).json({ error: "Ticket not found" });
    }
    tickets = tickets.filter(function (t) {
    return t.id !== id;
    });
    res.json({message: "Ticket deleted" });
})

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
})