function epiweekToDate(epiweek) {
  const year = Math.floor(epiweek / 100);
  const week = epiweek % 100;

  // ISO week: Week 1 starts with the first Thursday of the year
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = (dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek); // move to Monday
  const monday = new Date(simple);
  monday.setDate(simple.getDate() + diff);

  return monday; // Date object for the Monday of that epiweek
}

function formatEpiweekLabel(epiweek) {
  if (epiweek === "monthly") return "Monthly Total";

  const startDate = epiweekToDate(epiweek);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return `Week of ${startDate.toLocaleDateString("en-US", options)}`;
}

module.exports = { epiweekToDate, formatEpiweekLabel };