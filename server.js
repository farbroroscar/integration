const express = require('express');
const { mapPeopleToXMLConvertibleFormat, validateParentTagOrder } = require('./peopleFunctions');
const {
  generateXml,
  readDataFromFile,
  formatLineBasedDataToXMLConvertibleData
} = require('./utils');

const app = express();

const PORT = 4000;
const FILE_PATH = './people.txt';

app.get('/people', (req, res) => {
  const isTest = !!req.headers.test;
  const testPath = req.headers.testpath;
  const path = !isTest ? FILE_PATH : testPath;

  const onError = (_err) => res.sendStatus(500);

  const onSuccess = (peopleAsFileData) => {
    const peopleFormatted = formatLineBasedDataToXMLConvertibleData(peopleAsFileData);
    const isValidOrderOfPeopleElements = validateParentTagOrder(peopleFormatted);

    if (!isValidOrderOfPeopleElements) {
      res.sendStatus(500);
      return;
    }

    const people = mapPeopleToXMLConvertibleFormat(peopleFormatted);

    const peopleAsXML = generateXml(people);
    res.send(peopleAsXML);
  };

  readDataFromFile(path, onSuccess, onError);
});

app.listen(PORT, () => {
  console.log('listening to port: ', PORT);
});
