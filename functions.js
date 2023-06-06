const xml2js = require("xml2js");
const fs = require("fs");

const peopleElements = {
  P: "person",
  T: "phone",
  A: "address",
  F: "family",
};

const PERSON = {
  PERSON: "person",
  PHONE: "phone",
  ADDRESS: "address",
  FAMILY: "family",
};

const getPeople = () => {
  const peopleFromFile = fs.readFileSync("./people.txt", "utf8");

  const peopleFormated = peopleFromFile
    .split(/[\n,]+/) // Removes linebreaks.
    .map((line) => line.split("|")); // Divides each elment propery insted of separating them with "|".

  const validOrderOfPeopleElements = validatePeople(peopleFormated);

  if (!validOrderOfPeopleElements) {
    // fix proper message...
    return "bad content";
  }

  const peopleCharactersMappedToWords = peopleFormated.map((element) => {
    const [_, ...rest] = element;
    return [peopleElements[element[0]], ...rest]; // Map single charachter to word.
  });

  const separatePersons = [];

  peopleCharactersMappedToWords.reduce((acc, current, index, array) => {
    const isNewPerson = current[0] === PERSON.PERSON;
    const isNotFirstRound = index > 0;
    const isLastRound = index === array.length - 1;

    if (isLastRound) {
      separatePersons.push([...acc, current]);
      return;
    }
    if (isNewPerson && isNotFirstRound) {
      separatePersons.push(acc);
      return [current];
    }

    return [...acc, current];
  }, []);

  const people = separatePersons.map((person) =>
    createXMLConvertiblePerson(person)
  );

  const XML = generateXml({ people });

  return XML;
};

const createXMLConvertiblePerson = (person) => {
  const convertablePerson = person.reduce((acc, current) => {
    const [parentElement, ...rest] = current;
    const children = makeChildren(parentElement, rest);
    const shouldAddNewPerson = parentElement === PERSON.PERSON;
    const shouldAddPhoneToFamily =
      parentElement === PERSON.PHONE && acc.person.family;
    const shouldAddAddressToFamily =
      parentElement === PERSON.ADDRESS && acc.person.family;

    if (shouldAddNewPerson) {
      return { ...acc, [parentElement]: children };
    }

    if (shouldAddAddressToFamily || shouldAddPhoneToFamily) {
      acc.person.family = { ...acc.person.family, [parentElement]: children };
      return acc;
    }

    acc.person = { ...acc.person, [parentElement]: children };
    return acc;
  }, []);

  return convertablePerson;
};

const generateXml = (data) => {
  const builder = new xml2js.Builder();
  return builder.buildObject(data);
};

const makeChildren = (parent, children) => {
  if (parent === PERSON.PERSON) {
    return {
      name: children[0],
      lastName: children[1],
    };
  }
  if (parent === PERSON.PHONE) {
    return {
      mobile: children[0],
      landLine: children[1],
    };
  }
  if (parent === PERSON.ADDRESS) {
    return {
      street: children[0],
      city: children[1],
      zipCode: children[2],
    };
  }
  if (parent === PERSON.FAMILY) {
    return {
      name: children[0],
      born: children[1],
    };
  }
};

const validatePeople = (people) => {
  const parentElementCharacters = people.map((tag) => tag[0]);
  const isValidSequence = validateTagOrder(parentElementCharacters);
  return isValidSequence;
};

const validateTagOrder = (peopleTagSequence) => {
  const validCharachterOrder = !!peopleTagSequence.reduce(
    (acc, currentChar) => {
      if (!acc) {
        return false;
      }

      const previousCharachter = acc.slice(-1)[0];
      const canFollowP =
        currentChar === "T" || currentChar === "A" || currentChar === "F";
      const canFollowF =
        currentChar === "T" || currentChar === "A" || currentChar === "P";

      if (previousCharachter === "P") {
        return canFollowP ? [...acc, currentChar] : false;
      }

      if (previousCharachter === "F") {
        return canFollowF ? [...acc, currentChar] : false;
      }
      return [...acc, currentChar];
    },
    []
  );

  return validCharachterOrder;
};

module.exports = getPeople;

// cad har jag gjort?
// lagt till fix för att jag inte alltid fick med sista elementet.
// lagt till validering
