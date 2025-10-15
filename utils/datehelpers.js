// utils/dateHelpers.js
function getDateRange(range) {
  const now = new Date();

  switch (range) {
    case "week":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        end: now,
      };
    case "month":
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        end: now,
      };
    case "year":
      return {
        start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        end: now,
      };
    default:
      throw new Error("Invalid range. Must be one of: week, month, year");
  }
}

module.exports = { getDateRange };
