function removeNestedNullUndefinedEmptyString(obj: Record<string, any>) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeNestedNullUndefinedEmptyString(obj[key]);
    }
  }
  return obj;
}

export default removeNestedNullUndefinedEmptyString;
