function convertAmountToCents(amount: number) {
  if (isNaN(amount) || amount < 0) {
    throw new Error('Invalid input: amount should be a non-negative number');
  }
  return amount * 100;
}

export default convertAmountToCents;
