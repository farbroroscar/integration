const peopleElements = {
  P: 'person',
  T: 'phone',
  A: 'address',
  F: 'family'
};

const PERSON = {
  PERSON: 'person',
  PHONE: 'phone',
  ADDRESS: 'address',
  FAMILY: 'family'
};

const mapPeopleToXMLConvertibleFormat = (people) => {
  const XMLConvertiblePeople = people
    .map((row) => {
      const [char, ...rest] = row;
      return [peopleElements[char], ...rest]; // Map single character to word.
    })
    .reduce((acc, current) => {
      const isNewPerson = current[0] === PERSON.PERSON;
      const newAcc = [...acc];

      if (isNewPerson) {
        newAcc.push([current]);
      } else {
        newAcc[newAcc.length - 1].push(current);
      }

      return newAcc;
    }, [])
    .map((person) => createXMLConvertiblePerson(person));

  return { people: XMLConvertiblePeople };
};

const createXMLConvertiblePerson = (person) => {
  const XMLconvertiblePerson = person.reduce((acc, current) => {
    const [parentElement, ...rest] = current;
    const children = makeChildren(parentElement, rest);

    const shouldAddNewPerson = parentElement === PERSON.PERSON;
    const shouldAddPhoneToFamily = parentElement === PERSON.PHONE && acc.person.family;
    const shouldAddAddressToFamily = parentElement === PERSON.ADDRESS && acc.person.family;

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

  return XMLconvertiblePerson;
};

const makeChildren = (parent, children) => {
  if (parent === PERSON.PERSON) {
    return {
      name: children[0],
      lastName: children[1]
    };
  }
  if (parent === PERSON.PHONE) {
    return {
      mobile: children[0],
      landLine: children[1]
    };
  }
  if (parent === PERSON.ADDRESS) {
    return {
      street: children[0],
      city: children[1],
      zipCode: children[2]
    };
  }
  if (parent === PERSON.FAMILY) {
    return {
      name: children[0],
      born: children[1]
    };
  }
};

const validateParentTagOrder = (people) => {
  const parentElementCharacters = people.map((tag) => tag[0]);

  const isValidSequence = !!parentElementCharacters.reduce((acc, current) => {
    if (!acc) {
      return false;
    }

    const previousCharacter = acc.slice(-1)[0];

    const isRepeat = current === previousCharacter;
    const canFollowP = current === 'T' || current === 'A' || current === 'F';
    const canFollowF = current === 'T' || current === 'A' || current === 'P';

    if (isRepeat) {
      return false;
    }

    if (previousCharacter === 'P') {
      return canFollowP ? [...acc, current] : false;
    }

    if (previousCharacter === 'F') {
      return canFollowF ? [...acc, current] : false;
    }

    return [...acc, current];
  }, []);

  return isValidSequence;
};

module.exports = { mapPeopleToXMLConvertibleFormat, validateParentTagOrder };
