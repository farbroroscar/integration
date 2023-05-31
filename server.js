const express = require("express");
const buildXML = require("./functions");

const app = express();

const PORT = 4000;

// middleware
app.use((req, res, next) => {
  console.log(req.path);
  console.log(req.method);
  next();
});

app.use(express.text()); // map incomming reqest body as text.

app.get("/", (req, res) => {
  res.json({ message: "hejsan" });
});

app.post("/xml", (req, res) => {
  const { body } = req;
  const bodyAsXML = buildXML(body);
  res.send(bodyAsXML);
});

app.listen(PORT, () => {
  console.log("listening to port: ", PORT);
});
