export const positiveInteger = (str: string) => {
  if (isInteger(str) && isPositive(str)) {
    return undefined;
  }

  return "Must be an integer, 1 or higher";
};

export const nonNegativeInteger = (str: string) => {
  if (isInteger(str) && isPositiveInc0(str)) {
    return undefined;
  }

  return "Must be an integer, 0 or higher";
};

export const positiveNumber = (str: string) => {
  if (isNumeric(str) && isPositive(str)) {
    return undefined;
  }

  return "Must be a number, 1 or higher";
};

export const percentage = (str: string) => {
  if (isNumeric(str) && +str <= 100 && +str >= 0) {
    return undefined;
  }

  return "Must be % between 0 and 100";
};

export const naturalNumber = (str: string) => {
  if (isInteger(str) && isPositiveInc0(str)) {
    return undefined;
  }

  return "Must be an integer, 0 or higher";
};

function isInteger(str: string) {
  if (str === "") return;
  const num = Number(str);

  if (Number.isInteger(num)) {
    return true;
  }

  return false;
}

function isNumeric(str: string) {
  if (str === "") return false;
  return !isNaN(+str);
}

function isPositive(str: string) {
  return +str > 0;
}

function isPositiveInc0(str: string) {
  return +str >= 0;
}
