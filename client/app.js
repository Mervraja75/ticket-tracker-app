// PART 1 (day 14) (Making a filing cabinet)
// Each ticket is a folder, the array is the drawer, 
// and forEach is a worker checking each folder one by one

// PART 8: (DAY 17) 
// tickets is a const, and we can’t replace a const. 
// changed const tickets to let tickets.
// (push() worked with const because it changes the same array. 
// filter() creates a new one, so we need let.

let tickets = [ // task 1
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

/*
console.log(tickets[1].title); //task 2
console.log(tickets.length);

/* 
ARRAY.forEach(function (ITEM) {
    console.log(ITEM);
});


tickets.forEach(function (ticket) {
    console.log(ticket);
});

*/

// PART 2 (day 15) 
// (Document Object Model - DOM)
// Hanging a TV screen that shows what’s in the drawer. 
// Add a folder, and it shows up on the screen

//renderTickets() template
function renderTickets() {
    const list = document.querySelector("#ticket-list");
    list.innerHTML = "";

    tickets.forEach(function (ticket) {
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

        //PART 5 (DAY 17) 
        //connected to 
        // card.innerHTML = `
        // <h3></h3>
        // <p></p>
        card.querySelector("h3").textContent = ticket.title;
        card.querySelector("p").textContent = ticket.description;

        //PART 7 (DAY 19) - Make the Dropdown work (dropdown listener)
        const statusSelect = card.querySelector(".status-select");//find the status to select
        statusSelect.value = ticket.status; //dropdown for "change"
        statusSelect.addEventListener("change", function () {
            updateStatus(ticket.id, statusSelect.value); //inside listener, a function to update the status of the ticket
            //the id → get it from ticket 
            // the new status → get it from statusSelect 
        });

        //PART 8 (Day 20): Delete a Ticket (Make the button work)
        const deleteBtn = card.querySelector(".delete-btn");//find the delete button in this card
        deleteBtn.addEventListener("click", function () { //click to delete
            deleteTicket(ticket.id); //inside listener, a function to delete the ticket
        });

        list.appendChild(card);
    })
}

renderTickets();

// PART 3 (day 16) (Doorbell)
// When someone rings it (clicks Submit), 
// a worker comes and reads their form
const form = document.querySelector("form"); //find the form
form.addEventListener("submit", function (event) { // Submit listener
    event.preventDefault(); //stop the reload

    // read the 4 values
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const priority = document.querySelector("#priority").value;
    const category = document.querySelector("#category").value;
    

    //PART 3 (DAY 16)
    // log them (Build an object from the values and log it)
    const newTicket = {
        title: title,
        description: description,
        priority: priority,
        category: category,

        //PART 5 (DAY 17) - Add a Ticket
        // Step 1
        id: Date.now(),

        //Without quotes, JS treats open as a variable name, not text.
        // error without quotes : "function open() { [native code] }"
        status: "open", 
        createdAt: new Date().toISOString().slice(0, 10),

    };

    // PART 3 (day 16) log it
    console.log(newTicket);

    //PART 6: DAY 18 (FORM VALIDATION)
    // STEP 2
    const errorMessage = document.querySelector("#form-error");
    if (title.trim() === "" || description.trim() === "") {
        errorMessage.textContent = "Please fill in the title and description.";
        return;
    }

    // If the check passes, clear any old error
    errorMessage.textContent = "";

     // PART 5 (DAY 17) 
     // Step 2
    tickets.push(newTicket);
    renderTickets();

    //PART 6: DAY 18 (FORM VALIDATION)
    form.reset();

});

//PART 7 (DAY 19): updateStatus
// add a status dropdown on each card 
// we can change a ticket from Open to In Progress to Closed.
function updateStatus(id, newStatus) {
    const ticket = tickets.find(function (t) {
        return t.id === id;
    });
    ticket.status = newStatus;
    renderTickets();
}

//PART 8: Day 20: Delete a Ticket
function deleteTicket(id) {
    tickets = tickets.filter(function (t) {
        return t.id !== id;
    });
    renderTickets();

    if (!confirm("Are you sure you want to DELETE this ticket?")) {
        return;
    }
}








