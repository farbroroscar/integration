const express = require("express");
const { mapPeopleToXMLConvertibleFormat } = require("./peopleFunctions");
const { generateXml, readDataFromFile } = require("./utils");

const app = express();

const PORT = 4000;
const FILE_PATH = "./people.txt";

app.use(express.text()); // map incomming reqest body as text.

app.get("/people", (_req, res) => {
  const onError = (_err) => {
    res.sendStatus(500);
    return;
  };

  const onSuccess = (peopleAsFileData) => {
    const people = mapPeopleToXMLConvertibleFormat(peopleAsFileData);
    if (!people) {
      res.sendStatus(500);
      return;
    }
    const peopleAsXML = generateXml(people);
    res.send(peopleAsXML);
  };

  readDataFromFile(FILE_PATH, onSuccess, onError);
});

app.listen(PORT, () => {
  console.log("listening to port: ", PORT);
});
