const { formatLineBasedDataToXMLConvertibleData } = require("./utils");

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

const mapPeopleToXMLConvertibleFormat = (people) => {
  const isValidOrderOfPeopleElements = validateParentTagOrder(people);

  if (!isValidOrderOfPeopleElements) {
    return false;
  }

  const peopleCharactersMappedToWords = people.map((element) => {
    const [_, ...rest] = element;
    return [peopleElements[element[0]], ...rest]; // Map single character to word.
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

  const XMLConvertiblePeople = separatePersons.map((person) =>
    createXMLConvertiblePerson(person)
  );

  return { XMLConvertiblePeople };
};

const createXMLConvertiblePerson = (person) => {
  const convertiblePerson = person.reduce((acc, current) => {
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

  return convertiblePerson;
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

const validateParentTagOrder = (people) => {
  const parentElementCharacters = people.map((tag) => tag[0]);
  const isValidSequence = !!parentElementCharacters.reduce(
    (acc, currentCharacter) => {
      if (!acc) {
        return false;
      }

      const previousCharacter = acc.slice(-1)[0];

      const canFollowP =
        currentCharacter === "T" ||
        currentCharacter === "A" ||
        currentCharacter === "F";

      const canFollowF =
        currentCharacter === "T" ||
        currentCharacter === "A" ||
        currentCharacter === "P";

      if (previousCharacter === "P") {
        return canFollowP ? [...acc, currentCharacter] : false;
      }

      if (previousCharacter === "F") {
        return canFollowF ? [...acc, currentCharacter] : false;
      }
      return [...acc, currentCharacter];
    },
    []
  );

  return isValidSequence;
};

module.exports = { mapPeopleToXMLConvertibleFormat };
