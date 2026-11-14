const express = require ("express");
const router = express.Router();
const Ticket = require("../models/Ticket"); // the Ticket assistant (from models/Ticket.js)


//GET ALL tickets route from the DATABASE
router.get("/", async function (req, res) {
    try {
        const filter = {}; // start with no filter = "get everything"

        if(req.query.status) {  // did they ask for a certain status?
            filter.status = req.query.status; // yes → only that status
        }

        const allTickets = await Ticket.find(filter) // ask the cabinet, using the filter
            .sort({ createdAt: -1 }); // newest tickets first

        res.json(allTickets); // send them back
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" }); // 500 = the server's problem
    }
});

// GET ONE ticket route from the database
router.get("/:id", async function(req, res) { // async = this function can wait
    try {   // try = "attempt this..."
        const ticket = await Ticket.findById(req.params.id); // ask the cabinet for the ticket with this _id

        if (!ticket) { // nothing found?
            return res.status(404).json({ error: "Ticket not found" }); // 404, and stop
        }

        res.json(ticket); // found it! send it back
    } catch (error) { // the id was in a weird format
        res.status(404).json({ error: "Ticket not found"});
    }
    
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

//PATCH (update a ticket in the database)
router.patch("/:id", async function(req, res) { // async = this function can wait
    // Validate PATCH
    const allowedStatuses = ["open", "in-progress", "closed"]; // the only allowed answers

    if (!allowedStatuses.includes(req.body?.status)) { // not on the list?
        return res.status(400).json({ error: "Status must be open, in-progress or closed"}); // 400, and stop
    }

    try { // try = "attempt this..."
        const ticket = await Ticket.findByIdAndUpdate( // find the ticket AND change it, in one go
            req.params.id, // 1. which ticket (its _id)
            { status: req.body.status }, // 2. what to change
            { new: true, runValidators: true } // 3. extra settings (see below)
        );

        if (!ticket) { // no ticket with that _id?
            return res.status(404).json({ error: "Ticket not found" });
        }

        res.json(ticket); // send back the UPDATED ticket
    } catch (error) {
        res.status(404).json({ error: "Ticket not found" })

    }
});

//DELETE (remove ticket)
router.delete("/:id", async function(req, res) {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);

        if (!ticket){
            return res.status(404).json({ error: "Ticket not found" });
        }

        res.json({message: "Ticket deleted" });
    } catch (error) {
        res.status(404).json({ error: "Ticket not found" });
    }

});

module.exports = router;