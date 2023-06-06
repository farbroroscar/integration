const express = require("express");
const getPeople = require("./functions");

const app = express();

const PORT = 4000;

app.use(express.text()); // map incomming reqest body as text.

app.get("/people", (_req, res) => {
  const peopleAsXML = getPeople();
  res.send(peopleAsXML);
});

app.listen(PORT, () => {
  console.log("listening to port: ", PORT);
});
