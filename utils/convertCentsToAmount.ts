function convertCentsToAmount(cents: number) {
  if (isNaN(cents) || cents < 0) {
    throw new Error('Invalid input: cents should be a non-negative number');
  }
  return cents / 100;
}

export default convertCentsToAmount;
