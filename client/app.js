// ===============================
// 1.           DATA  
// ===============================    

// Where is the server? Pick the right address depending on where the app is running.
const isLocal = ["localhost", "127.0.0.1", ""].includes(window.location.hostname); // running on my computer?

const BASE_URL = isLocal
    ? "http://localhost:3000"                   // on my computer → use my local server
    : "https://ticket-tracker-app-sxui.onrender.com";   // online → use the real server (we'll fill this in on Day 57)

const API_URL = `${BASE_URL}/api/tickets`;      // the tickets window
const AUTH_URL = `${BASE_URL}/api/auth`;        // the login window

let token = localStorage.getItem("token");                      // the keycard 🪪 (or null if not logged in)
let currentUser = JSON.parse(localStorage.getItem("user") || "null"); // who is logged in (or null)

// Sample Tickets (used first time when the app opens)
let tickets = []

// ===============================
// 2.        FUNCTIONS  
// ===============================    

// Build one ticket card element
function createTicketCard (ticket) { 

    
    const card = document.createElement("article");
    card.className = "ticket-card";

    card.innerHTML = `
        <h3></h3>
        <p></p>
        <span class="badge priority-${ticket.priority}">${ticket.priority}</span>
        <span class="badge status-${ticket.status}">${ticket.status}</span>
        <time dateTime="${ticket.createdAt.slice(0, 10)}">${ticket.createdAt.slice(0, 10)}</time>

        <select class="status-select" aria-label="Change status">
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
        </select>

        <button class="delete-btn" type="button">Delete</button>
    `;

    // Use textContent for texts that are typed by users, no HTML run
    card.querySelector("h3").textContent = ticket.title;
    card.querySelector("p").textContent = ticket.description;

    // Status dropdown -> show current status, update on change
    const statusSelect = card.querySelector(".status-select");//find the status to select
    statusSelect.value = ticket.status; //dropdown for "change"
    statusSelect.addEventListener("change", function () {
        updateStatus(ticket._id, statusSelect.value); //inside listener, a function to update the status of the ticket
    });

    // Delete ticket button
    const deleteBtn = card.querySelector(".delete-btn");//find the delete button in this card
    deleteBtn.addEventListener("click", function () { //click to delete
        deleteTicket(ticket._id); //inside listener, a function to delete the ticket
    });

    // Requesters can't change status or delete, so hide those controls
    if (currentUser.role !== "tech") {   // not a tech?
        statusSelect.hidden = true;      // hide the status dropdown
        deleteBtn.hidden = true;         // hide the Delete button
    }

    return card; 
}

// returns the tickets that matches the search and status filter
function getVisibleTickets () {

    // Read the search text and selected status
    const searchText = document.querySelector("#search").value.toLowerCase();
    const statusFilter = document.querySelector("#status-filter").value;
    const visibleTickets = tickets.filter(function (t) {
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        const matchesSearch = t.title.toLowerCase().includes(searchText);
        return matchesStatus && matchesSearch;
    });

    return visibleTickets;
}

// Brings the visible tickets to the page
function renderTickets() { // READ (CRUD)
    const list = document.querySelector("#ticket-list");
    list.innerHTML = "";
   
    const visibleTickets = getVisibleTickets();

    visibleTickets.forEach(function (ticket) {
        const card = createTicketCard(ticket);
        list.appendChild(card);
    });
}

// Change a ticket's status on the server, then show the fresh list
async function updateStatus(id, newStatus) { // UPDATE (CRUD) // async = this function can wait
    await fetch(`${API_URL}/${id}`, { // the address of ONE ticket, e.g. .../api/tickets/5
        method: "PATCH", // PATCH = change part of something
        headers: authHeaders(),                       // JSON + keycard 🪪
        body: JSON.stringify({ status: newStatus }), // send only the new status
    });

    await loadTickets(); // get the fresh list and show it
}

//Delete a ticket on the server after receiving confirmation from user
async function deleteTicket(id) { // DELETE (CRUD)

    //1. ASK FIRST
    if (!confirm("Are you sure you want to DELETE this ticket?")) {
        return;
    }

    //2. TELL THE SERVER TO DELETE IT
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),    // ✅ show the keycard 🪪
    });

    //3. GET THE FRESH LISH AND SHOW IT
    await loadTickets();

}

// Get the tickets from the server (showing the keycard), then draw them
async function loadTickets() {
    const response = await fetch(API_URL, { headers: authHeaders() }); // ask, and show the keycard

    if (!response.ok) {          // keycard rejected? (missing, fake, or expired)
        logout();                // throw it away and show the login form
        return;                  // stop here
    }

    tickets = await response.json(); // open the answer and put it in tickets
    renderTickets();                 // show them on the screen
}

// Show the ticket app (after logging in)
function showApp() {
    document.querySelector("#login-section").hidden = true;  // hide the login form
    document.querySelector("#app").hidden = false;           // show the ticket app
    document.querySelector("#user-bar").hidden = false;      // show the name + Log out bar
    document.querySelector("#user-name").textContent =
        `${currentUser.name} (${currentUser.role})`;         // like "Test User (tech)"
}

// Show the login form (when nobody is logged in)
function showLogin() {
    document.querySelector("#login-section").hidden = false; // show the login form
    document.querySelector("#app").hidden = true;            // hide the ticket app
    document.querySelector("#user-bar").hidden = true;       // hide the name + Log out bar
}

// Build the headers for every ticket request: "it's JSON" + "here's my keycard"
function authHeaders() {
    return {
        "Content-Type": "application/json",     // the body (if any) is JSON
        "Authorization": `Bearer ${token}`,     // show the keycard 🪪
    };
}

// Log out: throw away the keycard and go back to the login form
function logout() {
    token = null;                               // forget the keycard
    currentUser = null;                         // forget who it was
    localStorage.removeItem("token");           // take the keycard out of your pocket
    localStorage.removeItem("user");            // forget the saved user
    tickets = [];                               // clear the tickets from the screen's list
    showLogin();                                // show the login form again
}

// ===============================
// 3.     EVENT LISTENERS  
// =============================== 

// New Ticket Form
const form = document.querySelector("#ticket-form"); // find the NEW TICKET form by its id
form.addEventListener("submit", async function (event) { // Submit listener (async = this function can wait)
    event.preventDefault(); //stop the reload

    // read the 4 values
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const priority = document.querySelector("#priority").value;
    const category = document.querySelector("#category").value;

    // Stop if the title or description is empty
    const errorMessage = document.querySelector("#form-error");
    if (title.trim() === "" || description.trim() === "") {
        errorMessage.textContent = "Please fill in the title and description.";
        return;
    }
    // If the check passes, clear any old error
    errorMessage.textContent = "";
    

    // Build the new ticket
    const newTicket = {
        title: title,
        description: description,
        priority: priority,
        category: category,

    };

    //send the new ticket to the server and wait
    await fetch(API_URL, {
        method: "POST", // POST = create something new
        headers: authHeaders(),                           // ✅ JSON + keycard 🪪
        body: JSON.stringify(newTicket), // pack the ticket into text
    });

    // Get the fresh list from the server and show it
    await loadTickets();

    form.reset();

});


//Render the list of tickets while typing in the search box
const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", function () {
    renderTickets();
});

//Render the list of tickets when the status filter changes
const statusFilterSelect = document.querySelector("#status-filter");
statusFilterSelect.addEventListener("change", function () {
    renderTickets();
});

// Login form: check the email + password with the server
const loginForm = document.querySelector("#login-form");                 // find the login form
loginForm.addEventListener("submit", async function (event) {            // async = this function can wait
    event.preventDefault();                                              // stop the page reload

    const email = document.querySelector("#login-email").value;          // what they typed
    const password = document.querySelector("#login-password").value;    // what they typed
    const loginError = document.querySelector("#login-error");           // where errors go

    const response = await fetch(`${AUTH_URL}/login`, {                  // send to the login window
        method: "POST",                                                  // POST = send something
        headers: { "Content-Type": "application/json" },                 // just "it's JSON" (no keycard yet)
        body: JSON.stringify({ email: email, password: password }),      // pack it as text
    });

    const data = await response.json();                                  // open the server's reply

    if (!response.ok) {                                                  // not a success (like 401)?
        loginError.textContent = data.error;                             // show the server's message
        return;                                                          // stop here
    }

    token = data.token;                                                  // keep the keycard 🪪
    currentUser = data.user;                                             // remember who logged in
    localStorage.setItem("token", token);                                // put the keycard in your pocket
    localStorage.setItem("user", JSON.stringify(currentUser));           // remember the user too

    loginError.textContent = "";                                         // clear old errors
    loginForm.reset();                                                   // empty the login boxes
    showApp();                                                           // switch to the ticket app
    await loadTickets();                                                 // get the tickets
});

// Log out button: throw away the keycard
const logoutBtn = document.querySelector("#logout-btn"); // find the Log out button
logoutBtn.addEventListener("click", function () {         // when it's clicked...
    logout();                                             // ...forget the keycard and show the login form
});
// ===============================
// 4.          START 
// =============================== 


// Already logged in? Show the app. Otherwise, show the login form.
if (token && currentUser) {   // do we have a keycard AND know who it is?
    showApp();                // yes → show the ticket app
    loadTickets();            // and get the tickets
} else {
    showLogin();              // no → show the login form
}




