/**
 * sanitizeQueryParams
 * Converts certain query params from strings to numbers or booleans.
 *
 * @param {object} query - req.query object
 * @param {string[]} numericKeys - keys that should be numbers
 * @param {string[]} booleanKeys - keys that should be booleans
 * @returns {object} - sanitized query object
 */
function sanitizeQueryParams(query, numericKeys = [], booleanKeys = []) {
  const sanitized = { ...query };

  // Convert numeric values
  numericKeys.forEach((key) => {
    if (sanitized[key] !== undefined) {
      const val = Number(sanitized[key]);
      if (!isNaN(val)) sanitized[key] = val;
      else throw new Error(`Query parameter ${key} must be a number`);
    }
  });

  // Convert boolean values
  booleanKeys.forEach((key) => {
    if (sanitized[key] !== undefined) {
      const val = sanitized[key].toLowerCase();
      if (val === "true") sanitized[key] = true;
      else if (val === "false") sanitized[key] = false;
      else throw new Error(`Query parameter ${key} must be true or false`);
    }
  });

  return sanitized;
}

module.exports = { sanitizeQueryParams };