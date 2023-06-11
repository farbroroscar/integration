const expectedXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<people>
  <person>
    <name>Oscar</name>
    <lastName>Lindberg</lastName>
  </person>
</people>`;

const getPeople = async (path = './test/peopleTest.txt') =>
  await fetch('http://localhost:4000/people', {
    headers: { test: '1', testpath: path }
  }).then((response) => response.text());

test('1. Should be able to send a get request to server and have it return XML that was read from a file and converted from a linebased format.', () => {
  getPeople().then((data) => expect(data).toBe(expectedXML));
});

test('2. Server should return Internal Server Error when there is no file to read from.', () => {
  const path = './fail';
  getPeople(path).then((resp) => expect(resp).toBe('Internal Server Error'));
});

test('3. Server should return Internal Server Error when people tag order is incorrect.', () => {
  const path = './test/peopleFailValidationTagOrder.txt';
  getPeople(path).then((resp) => expect(resp).toBe('Internal Server Error'));
});
