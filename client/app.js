// PART 1
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

// PART 2

function renderTickets() {
    const list = document.querySelector("#ticket-list");
    list.innerHTML = "";

    tickets.forEach(function (ticket) {
        const card = document.createElement("article");
        card.className = "ticket-card";

        card.innerHTML = `
            <h3>${ticket.title}</h3>
            <p>${ticket.description}</p>
            <span class="badge priority-${ticket.priority}">${ticket.priority}</span>
            <span class="badge status-${ticket.status}">${ticket.status}</span>
            <time dateTime="${ticket.createdAt}">${ticket.createdAt}</time>
        `;

        list.appendChild(card);
    })
}

renderTickets();


