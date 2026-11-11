const express = require ("express");
const router = express.Router();
const Ticket = require("../models/Ticket"); // the Ticket assistant (from models/Ticket.js)

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

//GET ALL ROUTE from the DATABASE
router.get("/", async function (req, res) {
    const allTickets = await Ticket.find();
    res.json(allTickets);
});

// GET ONE ROUTE
router.get("/:id", function(req, res) {
    const id = Number(req.params.id);
    const ticket = tickets.find(function (t) {
        return t.id === id;
    })
    if (!ticket){
        return res.status(404).json({ error: "Ticket not found" });
    }
        res.json(ticket);
    
});

//POST ROUTE
router.post("/", async function (req, res) {
    //Validate POST
    const title = req.body.title;
    const description = req.body.description;
    if (!title || title.trim() === "" || !description || description.trim() === "" ) {
        return res.status(400).json({ error: "Title and description are required"});
    }

    try {
        const newTicket = await Ticket.create({
            title: title,
            description: description,
            priority: req.body.priority,
            category: req.body.category,
        });

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

//PATCH (update a ticket)
router.patch("/:id", function(req, res) {
    // Validate PATCH
    const allowedStatuses = ["open", "in-progress", "closed"];

    if (!allowedStatuses.includes(req.body?.status)) {
        return res.status(400).json({ error: "Status must be open, in-progress or closed"});
    }

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

//DELETE (remove ticket)
router.delete("/:id", function(req, res) {
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

module.exports = router;