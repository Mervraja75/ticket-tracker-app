import express, { Request, Response } from "express"; // the server tool, plus the Request and Response labels
import Ticket from "../models/Ticket";                 // the Ticket assistant (from models/Ticket)
// The only 3 allowed statuses (same as the schema's enum)
type Status = "open" | "in-progress" | "closed";

const router = express.Router();                      // the mini app for ticket routes

// GET ALL tickets (optionally only one status, like ?status=open)
router.get("/", async function (req: Request, res: Response) {     // async = this function can wait
    try {                                                          // try = "attempt this..."
        const status = req.query.status;                    // what status did they ask for? (might be nothing)
        const filter: { status?: Status } = {};             // a box that MAY hold one of the 3 real statuses

        if (status === "open" || status === "in-progress" || status === "closed") { // is it a real status?
            filter.status = status;                         // yes → only those tickets
        
        }                                                   // no → the box stays empty = get everything
        const allTickets = await Ticket.find(filter)               // ask the cabinet, using the filter
            .sort({ createdAt: -1 });                              // newest tickets first

        res.json(allTickets);                                      // send them back
    } catch (error) {                                              // ...if the database has a problem
        res.status(500).json({ error: "Something went wrong" });   // 500 = the server's problem
    }
});

// GET ONE ticket by its _id
router.get("/:id", async function (req: Request, res: Response) {  // async = this function can wait
    try {                                                          // try = "attempt this..."
        const ticket = await Ticket.findById(req.params.id);       // ask the cabinet for the ticket with this _id

        if (!ticket) {                                             // nothing found?
            return res.status(404).json({ error: "Ticket not found" }); // 404, and stop
        }

        res.json(ticket);                                          // found it! send it back
    } catch (error) {                                              // the id was in a weird format
        res.status(404).json({ error: "Ticket not found" });       // 404
    }
});

// POST: create a new ticket
router.post("/", async function (req: Request, res: Response) {    // async = this function can wait
    const title = req.body?.title;                                 // the title they sent
    const description = req.body?.description;                     // the description they sent

    // Stop if the title or description is missing or only spaces
    if (!title || title.trim() === "" || !description || description.trim() === "") {
        return res.status(400).json({ error: "Title and description are required" }); // 400, and stop
    }

    try {                                                          // try = "attempt to save..."
        const newTicket = await Ticket.create({                    // ask the assistant to file a new ticket
            title: title,                                          // from the request
            description: description,                              // from the request
            priority: req.body.priority,                           // from the request
            category: req.body.category,                           // from the request
        });

        res.status(201).json(newTicket);                           // 201 = created! send back the saved ticket
    } catch (error) {                                              // ...if the schema refuses it
        res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" }); // ✨ NEW: 400 + the reason
    }
});

// PATCH: update a ticket's status
router.patch("/:id", async function (req: Request, res: Response) { // async = this function can wait
    const allowedStatuses = ["open", "in-progress", "closed"];     // the only allowed answers

    if (!allowedStatuses.includes(req.body?.status)) {             // not on the list?
        return res.status(400).json({ error: "Status must be open, in-progress, or closed" }); // 400, and stop
    }

    try {                                                          // try = "attempt this..."
        const ticket = await Ticket.findByIdAndUpdate(             // find the ticket AND change it, in one go
            req.params.id,                                         // 1. which ticket (its _id)
            { status: req.body.status },                           // 2. what to change
            { new: true, runValidators: true }                     // 3. send back the NEW version, and check the rules
        );

        if (!ticket) {                                             // no ticket with that _id?
            return res.status(404).json({ error: "Ticket not found" }); // 404, and stop
        }

        res.json(ticket);                                          // send back the UPDATED ticket
    } catch (error) {                                              // the id was in a weird format
        res.status(404).json({ error: "Ticket not found" });       // 404
    }
});

// DELETE: remove a ticket
router.delete("/:id", async function (req: Request, res: Response) { // async = this function can wait
    try {                                                          // try = "attempt this..."
        const ticket = await Ticket.findByIdAndDelete(req.params.id); // find the ticket AND remove it, in one go

        if (!ticket) {                                             // no ticket with that _id?
            return res.status(404).json({ error: "Ticket not found" }); // 404, and stop
        }

        res.json({ message: "Ticket deleted" });                   // done! say so
    } catch (error) {                                              // the id was in a weird format
        res.status(404).json({ error: "Ticket not found" });       // 404
    }
});

export default router; // share this router with other files (index.ts imports it)