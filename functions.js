const xml2js = require("xml2js");

const buildXML = (body) => {
  const split = body.split(/[\n,]+/); //  filter out linebreaks when data has multiple lines.
  // const split = body.split(/[\s,]+/); //  filter out linebreaks when data has multiple lines.
  const mappedToSeparatedObjects = split.map((line) => line.split("|"));
  mappedToSeparatedObjects.map((line) => (line[0] = peopleElements[line[0]])); // FIX!

  const separatePeople = [];
  mappedToSeparatedObjects.reduce((acc, current, index, arr) => {
    const isNewPerson = current[0] === "person";
    const isNotFirstRound = index > 1;
    const isLastRound = index === arr.length;
    if ((isNewPerson && isNotFirstRound) || isLastRound) {
      separatePeople.push(acc);
      return [current];
    }

    return [...acc, current];
  }, []);

  const people = separatePeople.map((person) =>
    generateXMLConvertiblePerson(person)
  );

  const XML = generateXml({ people });

  return XML;
};

const generateXMLConvertiblePerson = (peopleData) => {
  const convertableStructure = peopleData.reduce((acc, current) => {
    const [parentElement, ...rest] = current;
    const children = makeChildren(parentElement, rest);

    if (parentElement !== "person") {
      acc.person = { ...acc.person, [parentElement]: children };
      return { ...acc };
    }

    return { ...acc, [parentElement]: children };
  }, []);

  return { ...convertableStructure };
};

const generateXml = (data) => {
  const builder = new xml2js.Builder();
  return builder.buildObject(data);
};

const peopleElements = {
  P: "person",
  T: "phone",
  A: "address",
  F: "family",
};

// find better way.
const makeChildren = (parent, children) => {
  if (parent === "person") {
    return {
      name: children[0],
      lastName: children[1],
    };
  }
  if (parent === "phone") {
    return {
      mobile: children[0],
      landLine: children[1],
    };
  }
  if (parent === "address") {
    return {
      street: children[0],
      city: children[1],
      zipCode: children[2],
    };
  }
  if (parent === "family") {
    return {
      name: children[0],
      born: children[1],
      //could have additional phone
      //could have additional address
    };
  }
};

// P|Victoria|Bernadotte
// T|070-0101010|0459-123456
// A|HagaSlott|Stockholm|101
// F|Estelle|2012
// A|Solliden|Öland|10002
// F|Oscar|2016
// T|0702-020202|02-202020
// P|Joe|Biden
// A|WhiteHouse|Washington,D.C
// P kan följas av T,A och F
// F kan följas av T och A

// <people>
// <person>
//   <firstname>Victoria</firstname>

//   <lastname>Bernadotte</lastname>
//   <address>
//     <street>HagaSlott</street>
//   </address>
//   <phone>
//     <mobile>070-0101010</mobile>
//   </phone>
//   <family>
//     <name>Estelle</name>
//     <born>2012</born>
//     <address>...</address>
//   </family>
//   <family>...</family>
// </person>
// <person>...</person>
// </people>

module.exports = buildXML;
