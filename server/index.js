console.log("Hello from the server");

const tickets = [
    { id: 1, title: "Printer not working", status: "open"},
]

tickets.forEach(function (ticket) {
    console.log(ticket.title)
})

const openTickets = tickets.filter(function (t) {
    return t.status === "open";
})

console.log("Open Tickets", openTickets.length);
