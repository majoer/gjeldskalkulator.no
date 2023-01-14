export const positiveNumberInc0 = (str: string) => {
  if (isNumeric(str) && isPositiveInc0(str)) {
    return undefined;
  }

  return "errors.positiveNumber";
};

export const percentage = (str: string) => {
  if (isNumeric(str) && +str <= 100 && +str >= 0) {
    return undefined;
  }

  return "errors.percentage";
};

export const naturalNumber = (str: string) => {
  if (isInteger(str) && isPositiveInc0(str)) {
    return undefined;
  }

  return "errors.naturalNumber";
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
