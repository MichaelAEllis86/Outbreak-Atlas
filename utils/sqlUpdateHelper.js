/**
 * Generates a partial SQL `UPDATE` clause for the users table.
 *
 * Example usage:
 *   sqlForPartialUpdate(
 *     { firstName: 'Aliya', zipCode: 12345 },
 *     { firstName: 'first_name', zipCode: 'zipcode' }
 *   )
 * Returns:
 *   {
 *     setCols: '"first_name"=$1, "zipcode"=$2',
 *     values: ['Aliya', 12345]
 *   }
 *
 * @param {Object} dataToUpdate - JS object containing fields to update (e.g., { firstName: 'Aliya' }).
 * @param {Object} jsToSql - JS to SQL column name mapping (e.g., { firstName: 'first_name' }).
 * @returns {{ setCols: string, values: any[] }} SQL fragment and values array.
 * @throws {BadRequestError} If no data is provided.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql={}) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };