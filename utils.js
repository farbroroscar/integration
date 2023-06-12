const xml2js = require('xml2js');
const fs = require('fs');

const UTF_8 = 'utf-8';

const readDataFromFile = (path, onSuccess, onError, format = UTF_8) => {
  fs.readFile(path, format, (err, data) => {
    if (err) {
      onError(err);
      return;
    }
    onSuccess(data);
  });
};

const generateXml = (data) => {
  const builder = new xml2js.Builder();
  return builder.buildObject(data);
};

const formatLineBasedDataToXMLConvertibleData = (lineBasedData) => {
  return lineBasedData
    .split(/[\n,]+/) // Removes linebreaks.
    .map((line) => line.split('|')); // Divides each element properly instead of separating them with "|"
};

module.exports = {
  generateXml,
  readDataFromFile,
  formatLineBasedDataToXMLConvertibleData
};
