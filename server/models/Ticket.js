const mongoose = require("mongoose"); // database assistant

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String, // text
            required: true, // can't be empty
            trim: true, // cut off extra spaces at start and end
        },

        description: {
            type: String, 
            required: true, 
            trim: true, 
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"], //only 3 answers allowed
            default: "low", // every new ticket starts as "low"
        },

        category: {
            type: String,
            enum: ["hardware", "software", "network", "account"], //only 4 answers allowed
            default: "hardware", // every new ticket starts as "hardware"
        },

        status: {
            type: String,
            enum: ["open", "in-progress", "closed"], //only 3 answers allowed
            default: "open", // every new ticket starts as "open"
        },
    },
    { timestamps: true } // created date and last updated automatically added
);

module.exports = mongoose.model("Ticket", ticketSchema);