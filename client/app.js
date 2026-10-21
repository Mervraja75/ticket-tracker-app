// PART 1 (day 14) (Making a filing cabinet)
// Each ticket is a folder, the array is the drawer, 
// and forEach is a worker checking each folder one by one
const tickets = [ // task 1
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
]

console.log(tickets[1].title); //task 2
console.log(tickets.length);

/* 
ARRAY.forEach(function (ITEM) {
    console.log(ITEM);
});
*/

tickets.forEach(function (ticket) {
    console.log(ticket);
})

// PART 2 (day 15) 
// (Document Object Model - DOM)
// Hanging a TV screen that shows what’s in the drawer. 
// Add a folder, and it shows up on the screen

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
        `;

        //PART 5 (DAY 17)
        card.querySelector("h3").textContent = ticket.title;
        card.querySelector("p").textContent = ticket.description;

        list.appendChild(card);
    })
}

renderTickets();

// PART 3 (day 16) (Doorbell)
// When someone rings it (clicks Submit), 
// a worker comes and reads their form

const form = document.querySelector("form"); //find the form
form.addEventListener("submit", function (event) { // listen for submit
    event.preventDefault(); //stop the reload

    // read the 4 values
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const priority = document.querySelector("#priority").value;
    const category = document.querySelector("#category").value;

    //log them (Build an object from the values and log it)
    const newTicket = {
        title: title,
        description: description,
        priority: priority,
        category: category,

        //PART 5 (DAY 17) - Add a Ticket
        // Step 1
        id: Date.now(),
        status: open,
        createdAt: new Date().toISOString().slice(0, 10),

    };

    // PART 3 (day 16) log it
    console.log(newTicket);

     // PART 5 (DAY 17) 
     // Step 2
    tickets.push(newTicket);
    renderTickets();

})


