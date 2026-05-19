require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");

const { findContact, createLead } = require("./bitrix");
const { makeCall } = require("./exotel");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/exotel/incoming", async (req, res) => {
  const phone = req.body.CallFrom || req.query.CallFrom;

  let contact = await findContact(phone);

  if (!contact) {
    const leadId = await createLead(phone);
    contact = { ID: leadId, NAME: "New Lead" };
  }

  io.emit("incoming-call", {
    phone,
    contact
  });

  res.status(200).send("OK");
});

app.post("/call", async (req, res) => {
  const result = await makeCall(req.body.phone);
  res.json(result);
});

server.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
