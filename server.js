const http = require("http");
const Koa = require("koa");

const app = new Koa();

app.use((ctx) => {
  console.log(ctx.headers);
});

const server = http.createServer(app.callback());

// const server = http.createServer((req, res) => {
//   const buffer = [];

//   req.on("data", (chunk) => {
//     buffer.push(chunk);
//   })

//   req.on("end", () => {
//     const data = Buffer.concat(buffer).toString();

//     console.log(data);
//   })

//   res.end("server response");
// });

const port = 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log(`Server is listening to port ${ port }`);
});