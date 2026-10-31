// ===============================
// 1.           DATA  
// ===============================          

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

// Load saved tickets from the browser, if there are any
const saved = localStorage.getItem("tickets");
if (saved !== null) {
    tickets = JSON.parse(saved); 
}

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
        <time dateTime="${ticket.createdAt}">${ticket.createdAt}</time>

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
        updateStatus(ticket.id, statusSelect.value); //inside listener, a function to update the status of the ticket
    });

    // Delete ticket button
    const deleteBtn = card.querySelector(".delete-btn");//find the delete button in this card
    deleteBtn.addEventListener("click", function () { //click to delete
        deleteTicket(ticket.id); //inside listener, a function to delete the ticket
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

// change the status of a ticket, save and render next ticket
function updateStatus(id, newStatus) { // UPDATE (CRUD)
    const ticket = tickets.find(function (t) {
        return t.id === id;
    });
    //updateStatus
    ticket.status = newStatus;
    saveTickets(); 
    renderTickets();
}

//Delete a ticket after receiving confirmation from user
function deleteTicket(id) { // DELETE (CRUD)

    //1. ASK FIRST
    if (!confirm("Are you sure you want to DELETE this ticket?")) {
        return;
    }

    //2. THEN DELETE
    tickets = tickets.filter(function (t) {
        return t.id !== id;
    });

    //3. THEN UPDATE THE SCREEN
    saveTickets();
    renderTickets();

}

//Save tickets history to the browser (localStorage only stores text)
function saveTickets() {
    localStorage.setItem("tickets", JSON.stringify(tickets)); //convert array(tickets) to text
}

// ===============================
// 3.     EVENT LISTENERS  
// =============================== 

// New Ticket Form
const form = document.querySelector("form"); //find the form
form.addEventListener("submit", function (event) { // Submit listener
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

        
        id: Date.now(),

        // "open" in quotes = text (without quotes, it's the browser's open() function)
        status: "open", 
        createdAt: new Date().toISOString().slice(0, 10),

    };

    // the submit listener
    // Add, save, render Tickets, and clear the form
    tickets.push(newTicket); // CREATE (CRUD)
    //
    saveTickets(); 
    renderTickets();

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

renderTickets(); // READ (CRUD)




