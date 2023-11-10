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

router

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
      ctx.response.body = tickets.map(({ id, name, status, created }) => {
        return { id, name, status, created };
      });
      return;
    case "ticketById":
      const { id } = ctx.request.query;
      if (id) {
        ctx.response.body = tickets.filter(ticket => ticket.id == id);
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
      const { name, description, status } = ctx.request.body;
      const id = uuid.v4();
      const created = Date.now();
      tickets.push({ id, name, description, status, created });

      ctx.response.body = id;
      return;
    default:
      ctx.response.status = 400;
      return;
  }
})

router.patch("/", ctx => {
  const { method } = ctx.request.query;

  switch (method) {
    case 'updateTicket':
      const {id, name, description, } = ctx.request.body;
      const id = uuid.v4();
      const created = Date.now();
      tickets.push({ id, name, description, status, created });

      ctx.response.body = id;
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