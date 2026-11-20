import mongoose from "mongoose"; // the database assistant

// The rules every user must follow
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,      // text
            required: true,    // must be filled in
            trim: true,        // cut off extra spaces
        },
        email: {
            type: String,      // text
            required: true,    // must be filled in
            unique: true,      //  NO two users can have the same email
            lowercase: true,   //  save as lowercase, so "Mervin@Email.com" = "mervin@email.com"
            trim: true,        // cut off extra spaces
        },
        password: {
            type: String,      // text (this will be the BLENDED password, never the real one!)
            required: true,    // must be filled in
        },
        role: {
            type: String,                    // text
            enum: ["requester", "tech"],     // only these 2 roles are allowed
            default: "requester",            // every new user starts as a regular requester
        },
    },
    { timestamps: true } // automatically add the date they signed up
);

// Make the "User" tool from the rules, and share it with other files
export default mongoose.model("User", userSchema);