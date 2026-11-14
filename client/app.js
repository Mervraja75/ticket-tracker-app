// ===============================
// 1.           DATA  
// ===============================    

const API_URL = "http://localhost:3000/api/tickets";

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
        <time dateTime="${ticket.createdAt.slice(0, 10)}"></time>

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
        headers: { "Content-Type": "application/json" }, // tell the server: this is JSON
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
    });

    //3. GET THE FRESH LISH AND SHOW IT
    await loadTickets();

}

//Function to ask the server
async function loadTickets() {
    const response = await fetch(API_URL);  // ask the server for tickets, and wait
    tickets = await response .json(); // open the answer and turn it into a list
    renderTickets(); // show the tickets on the screen
}

// ===============================
// 3.     EVENT LISTENERS  
// =============================== 

// New Ticket Form
const form = document.querySelector("form"); //find the form
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
        headers: { "Content-Type": "application/json" }, // tell the server: this is JSON
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

// ===============================
// 4.          START 
// =============================== 


loadTickets();




