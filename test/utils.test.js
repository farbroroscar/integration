const { generateXml, formatLineBasedDataToXMLConvertibleData } = require('../utils');

test('1. Should be able to generate XML if given correct data.', () => {
  const expectedXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<people>
  <person>
    <name>Oscar</name>
    <lastName>Lindberg</lastName>
  </person>
</people>`;

  expect(generateXml({ people: [{ person: { name: 'Oscar', lastName: 'Lindberg' } }] })).toBe(
    expectedXML
  );
});

test('1. Should be able convert linebased data to data that is convertible to XML.', () => {
  expect(
    formatLineBasedDataToXMLConvertibleData('P|testName|testLastName\nT|0763214446|0459-123456')
  ).toEqual([
    ['P', 'testName', 'testLastName'],
    ['T', '0763214446', '0459-123456']
  ]);
});
