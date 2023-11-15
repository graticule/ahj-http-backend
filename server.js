const http = require("http");
const Koa = require("koa");
const logger = require("koa-morgan")
const { koaBody } = require("koa-body");
const cors = require("@koa/cors");
const Router = require("koa-router");
const uuid = require("uuid");

let tickets = [
  {
    id: 0,
    name: "Ticket 0",
    status: true,
    created: Date.now(),
    description: "Description of Ticket 0: Ticket 0 Ticket 0 Ticket 0 Ticket 0 Ticket 0",
  },
  {
    id: 1,
    name: "Ticket 1",
    status: false,
    created: Date.now(),
    description: "Description of Ticket 1: Ticket 1 Ticket 1 Ticket 1 Ticket 1 Ticket 1",
  },
];

const app = new Koa();

const router = new Router();

app.use(logger("tiny"));

app.use(cors());

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

router.get("/", ctx => {
  const { method } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      const result = tickets.map( (ticket) => {
        return { "id": ticket.id, name: ticket.name, status: ticket.status, created: ticket.created };
      });
      console.log(result); 
      ctx.response.body = result;
      return;
    case "ticketById":
      const { id } = ctx.request.query;
      if (id) {
        ctx.response.body = tickets.find(ticket => ticket.id == id);
        return;
      }
    default:
      ctx.response.status = 400;
      return;
  }
})

router.post("/", ctx => {
  const { method } = ctx.request.query;

  switch (method) {
    case 'createTicket':
      const { name, description } = ctx.request.body;
      const id = uuid.v4();
      const created = Date.now();
      tickets.push({ id, name, description, status: false, created });

      ctx.response.status = 200;
      return;
    default:
      ctx.response.status = 400;
      return;
  }
})

router.put("/", ctx => {
  const { method } = ctx.request.query;

  switch (method) {
    case 'updateTicket':
      const { id, name, description, status } = ctx.request.body;
      const ticket = tickets.find(ticket => ticket.id == id);
      console.log(name, description, status, ticket);
      if (name !== undefined) {
        ticket.name = name;
      }
      if (description !== undefined) {
        ticket.description = description;
      }
      if (status !== undefined) {
        ticket.status = false;
        if (typeof status === "Boolean"){
          ticket.status = status;
        } else if (typeof status === "string"){
          if(status === "true") {
            ticket.status = true;
          }else {
            ticket.status = false;
          }
        }
      }
      console.log(ticket);
      ctx.response.status = 204
      return;
    default:
      ctx.response.status = 400;
      return;
  }
})

router.delete("/", ctx => {
  const { method, id } = ctx.request.query;
  console.log(method, id)

  switch (method) {
    case 'deleteTicket':
      tickets = tickets.filter((ticket) => ticket.id != id);
      console.log(tickets.map(ticket => ticket.id));
      ctx.response.status = 204
      return;
    default:
      ctx.response.status = 400;
      return;
  }
})

app.use(router.routes());

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log(`Server is listening to port ${port}`);
});