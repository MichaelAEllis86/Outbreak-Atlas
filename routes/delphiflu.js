// routes/flu.js! these are api routes for flu data from Delphi's FluView API
const express = require("express");
const axios = require("axios");
const router = new express.Router();
const {formatEpiweekLabel} = require("../utils/epiweek");
const DELPHI_API_KEY = process.env.DELPHI_API_KEY;
console.log("this is delphi api key from env--->", DELPHI_API_KEY);

if (!DELPHI_API_KEY) {
  console.warn("Warning: DELPHI_API_KEY is not set. Please set it in your environment variables.");
}

// baselines for 2023-2024 will change yearly and requires updating to maintain.
// source for these baselines is found here https://www.cdc.gov/fluview/overview/index.html values are %wILI
const wILIBaselines={
  nat:2.9,
  states:{
    "al":3.3,
    "ak":1.0,
    "az":3.6,
    "ar":3.7,
    "ca":3.6,
    "co":3.2,
    "ct":1.9,
    "de":2.4,
    "fl":3.3,
    "ga":3.3,
    "hi":3.6,
    "id":1.9,
    "il":2.3,
    "in":2.3,
    "ia":2.0,
    "ks":2.0,
    "ky":3.3,
    "la":3.7,
    "me":1.9,
    "md":2.4,
    "ma":1.9,
    "mi":2.3,
    "mn":2.3,
    "ms":3.3,
    "mo":2.0,
    "mt":3.2,
    "ne":2.0,
    "nv":3.6,
    "nh":1.9,
    "nj":4.2,
    "nm":3.7,
    "ny":4.2,
    "nc":3.3,
    "nd":3.2,
    "oh":2.3,
    "ok":3.7,
    "or":1.9,
    "pa":2.4,
    "ri":1.9,
    "sc":3.3,
    "sd":3.2,
    "tn":3.3,
    "tx":3.7,
    "ut":3.2,
    "vt":1.9,
    "va":2.4,
    "wa":1.9,
    "wv":2.4,
    "wi":2.3,
    "wy":3.2,
}
}

/**
 * Aggregates weekly FluView data into a single summary for a given range (month or year).
 *
 * @param {Array<Object>} epiWeeks - An array of mapped weekly flu data objects.
 *   Each object should include:
 *   - {number} total_patients - Total number of patients reported for the week.
 *   - {number} total_ILI_cases - Total influenza-like illness (ILI) cases reported.
 *   - {number} weighted_ILI_percent - Weighted ILI percentage for the week.
 *   - {number} reporting_providers - Number of reporting providers.
 *   - {Object<string, number|string>} age_breakdown - Age-stratified counts (may include "No data").
 *   - {string} region - The reporting region (state code or "nat").
 *
 * @param {string} range - The aggregation range ("month" or "year").
 *
 * @returns {Object|null} Aggregated summary object or null if no data.
 *   - {string} epiweek - Label for the aggregation period ("month" or "year").
 *   - {string} region - Region associated with the data.
 *   - {number} total_patients - Total patients aggregated across all weeks.
 *   - {number} total_ILI_cases - Total ILI cases aggregated across all weeks.
 *   - {number} raw_ILI_percent - Percentage of ILI cases among all patients.
 *   - {number} weighted_ILI_percent - Weighted percentage of ILI cases.
 *   - {number} reporting_providers - Sum of reporting providers across weeks.
 *   - {Object<string, number>} age_breakdown - Aggregated counts per age group.
 */
function aggregateData(epiWeeks, range) {
  if (!epiWeeks.length) return null;

  let totalPatients = 0;
  let totalILI = 0;
  let totalWeightedILI = 0;
  let reportingProviders = 0;
  let ageBreakdown = {};

  epiWeeks.forEach(week => {
    totalPatients += week.total_patients || 0;
    totalILI += week.total_ILI_cases || 0;
    totalWeightedILI += (week.weighted_ILI_percent || 0) * (week.total_patients || 0);
    reportingProviders += week.reporting_providers || 0;

    for (const [age, count] of Object.entries(week.age_breakdown || {})) {
      if (!ageBreakdown[age]) ageBreakdown[age] = 0;
      ageBreakdown[age] += count === "No data" ? 0 : count;
    }
  });

  return {
    epiweek: range, // "month" or "year"
    region: epiWeeks[0].region,
    total_patients: totalPatients,
    total_ILI_cases: totalILI,
    raw_ILI_percent: totalPatients ? (totalILI / totalPatients) * 100 : 0,
    weighted_ILI_percent: totalPatients ? totalWeightedILI / totalPatients : 0,
    reporting_providers: reportingProviders,
    age_breakdown: ageBreakdown
  };
}

/** Helper: Get current epiweek (for reference; not used to fetch data) */
function getCurrentEpiweek() {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return Number(`${now.getFullYear()}${week.toString().padStart(2, "0")}`);
}

/**
 * Maps raw Delphi FluView API data into a structured object with
 * totals, percentages, age breakdowns, and proportions.
 *
 * @function mapFluViewData
 * @param {Object} rawData - Raw data response from the Delphi FluView API.
 * @param {Array<Object>} rawData.epidata - Array of weekly epidemic data objects.
 * @returns {Object|null} A normalized flu data object for a single epiweek, or null if no data is available.
 *
 * @property {number} epiweek - CDC epiweek number (e.g., 202435).
 * @property {string} epiweek_label - Human-readable date label for the epiweek (via `formatEpiweekLabel`).
 * @property {string} release_date - Date the data was released (YYYY-MM-DD).
 * @property {string} region - Geographic region code (e.g., "nat" for national, "ny" for New York).
 * @property {number} total_patients - Total number of patients seen for the week.
 * @property {number} total_ILI_cases - Total number of influenza-like illness (ILI) cases reported.
 * @property {number} raw_ILI_percent - Percentage of visits for ILI (unadjusted).
 * @property {number} weighted_ILI_percent - Weighted ILI percentage (adjusted for provider coverage).
 * @property {number} reporting_providers - Number of providers reporting data for the week.
 * @property {Object<string, number|string>} age_breakdown - Absolute counts of ILI cases by age group.
 *   Keys:
 *   - "0-4 years"
 *   - "5-24 years"
 *   - "25-49 years"
 *   - "50-64 years"
 *   - "65+ years"
 *   - "Unknown"
 *   Values: number of cases or `"No data"`.
 * @property {Object<string, number|string>} age_proportions - Proportion of ILI cases by age group (as percentage of total patients).
 *   Keys match `age_breakdown`.
 *   Values: percentage (0–100) or `"No data"`.
 */
/**
 * Map raw Delphi FluView data into a friendly format.
 * Includes age breakdowns and proportions only for national-level ("nat") data,
 * since state-level records do not provide these fields.
 *
 * @param {Object} rawData - Raw data object from Delphi FluView API.
 * @returns {Object|null} - Formatted flu data, or null if no input data.
 */
function mapFluViewData(rawData) {
  if (!rawData || !rawData.epidata || rawData.epidata.length === 0) return null;
  const d = rawData.epidata[0];

  const ageMap = {
    num_age_0: "0-4 years",
    num_age_1: "5-24 years",
    num_age_2: "25-49 years",
    num_age_3: "50-64 years",
    num_age_4: "65+ years",
    num_age_5: "Unknown"
  };

  // Build raw breakdown
  const ageBreakdown = Object.keys(ageMap).reduce((acc, key) => {
    acc[ageMap[key]] = d[key] !== null ? d[key] : "No data";
    return acc;
  }, {});

  // Calculate proportions (only if data and total patients > 0)
  let ageProportions = {};
  if (d.num_patients && d.num_patients > 0) {
    for (const [label, count] of Object.entries(ageBreakdown)) {
      if (count === "No data") {
        ageProportions[label] = "No data";
      } else {
        ageProportions[label] = ((count / d.num_patients) * 100).toFixed(2); // percent
      }
    }
  } else {
    // If no patients or invalid data
    ageProportions = Object.fromEntries(
      Object.keys(ageBreakdown).map(label => [label, "No data"])
    );
  }

  

  // Handle missing data for the 25-49 age group
  if (ageProportions["25-49 years"] === "No data") {
    // Option 1: Exclude this age group from the proportions
    delete ageProportions["25-49 years"];

    // Option 2: Impute a value (e.g., average of other age groups)
    // const totalProportions = Object.values(ageProportions).reduce((sum, val) => sum + val, 0);
    // const numGroups = Object.values(ageProportions).filter(val => val !== "No data").length;
    // const averageProportion = totalProportions / numGroups;
    // ageProportions["25-49 years"] = averageProportion;
  }

  return {
    epiweek: d.epiweek,
    epiweek_label: formatEpiweekLabel(d.epiweek), // friendly label
    release_date: d.release_date,
    region: d.region,
    total_patients: d.num_patients,
    total_ILI_cases: d.num_ili,
    raw_ILI_percent: d.ili,
    weighted_ILI_percent: d.wili,
    reporting_providers: d.num_providers,
    age_breakdown: ageBreakdown,
    age_proportions: ageProportions
  };
}

/** GET Fetch Flu data by state and date range */
router.get("/data/:state/:range", async function (req, res, next) {
  try {
    let { state, range } = req.params;

    // --- Some basic validation. all valid statecodes from req.params are below along with 1 param that fits national data aka "nat" ---
    const validStates = ["nat","al","ak","az","ar","ca","co","ct","de","fl","ga","hi","id","il","in","ia","ks","ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc","nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy"];
    if (!validStates.includes(state.toLowerCase())) return res.status(400).json({ error: `Invalid state: ${state}` });
    // validation for range parameters. Range must be one of week, month, year as a string.
    const validRanges = ["week", "month", "year"];
    if (!validRanges.includes(range.toLowerCase())) return res.status(400).json({ error: `Invalid range: ${range}` });

    // Normalize inputs to lowercase
    state = state.toLowerCase();

    // --- Determine number of weeks to fetch a week's range is one week previous, a month is 4 weeks previous a year it 52 weeks previous could be changed for additional date range's---
    let weeksBack = range === "week" ? 1 : range === "month" ? 4 : 52;

    // --- Fetch data from Delphi FluView ---
    const baseUrl = "https://delphi.cmu.edu/epidata/api.php";
    // Fetch wide epiweek range to ensure we get latest available
    let url = `${baseUrl}?source=fluview&regions=${state}&epiweeks=200000-999999`;
    if (DELPHI_API_KEY) {
      url += `&api_key=${DELPHI_API_KEY}`;
    }
    console.log("Fetching data from URL:", url);
    const resp = await axios.get(url);
    console.log("API response received");
    const epidata = resp.data?.epidata || [];

    if (!epidata.length) return res.json([]); // no data available

    // --- Sort descending by epiweek and select needed weeks ---
    const sortedData = epidata.sort((a, b) => b.epiweek - a.epiweek);
    const selectedWeeks = sortedData.slice(0, weeksBack);

    // --- Map weeks safely ---
    // --- Map weeks safely ---
const mappedWeeks = selectedWeeks
  .map(entry => mapFluViewData({ epidata: [entry] }))
  .filter(Boolean);

// --- Aggregate for month or year ---
if (range === "month" || range === "year") {
  // Call aggregateData with the mapped weeks and the range type
  const totals = aggregateData(mappedWeeks, range);

  // Return a JSON object with both the totals and the individual weeks
  return res.json({
    [`${range}_totals`]: totals, // dynamic key: "month_totals" or "year_totals"
    weeks: mappedWeeks
  });
}

// Default for "week" range: just return the mapped week data
return res.json(mappedWeeks);
  } catch (err) {
    return next(err);
  }
});


/**
 * GET /trends/:state
 * Returns percent ILI trends for the 8 most recent reported weeks
 */
router.get("/trends/:state", async (req, res, next) => {
  try {
    let { state } = req.params;
    state = state.toLowerCase();
    
    const wILIBaseline = state === "nat"
    ? wILIBaselines.nat: wILIBaselines.states[state];

    const validStates = [
      "nat","al","ak","az","ar","ca","co","ct","de","fl","ga","hi","id","il","in","ia","ks",
      "ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc",
      "nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy"
    ];
    if (!validStates.includes(state)) return res.status(400).json({ error: `Invalid state: ${state}` });

    // --- Fetch data from Delphi FluView ---
    const baseUrl = "https://delphi.cmu.edu/epidata/api.php";
    let url = `${baseUrl}?source=fluview&regions=${state}&epiweeks=200000-999999`;
    if (DELPHI_API_KEY) url += `&api_key=${DELPHI_API_KEY}`;
    
    console.log("Fetching FluView trends from URL:", url);

    const resp = await axios.get(url);

    console.log("API response received");

    const epidata = resp.data?.epidata || [];

    if (!epidata.length) return res.json([]);

    // --- Sort descending by epiweek and select the most recent 8 weeks ---
    const sortedData = epidata.sort((a, b) => b.epiweek - a.epiweek);
    const recentWeeks = sortedData.slice(0, 8);
    // --- Map weeks safely with full structure (including age fields) ---

    const mappedWeeks = recentWeeks
      .map(entry => mapFluViewData({ epidata: [entry] })).filter(Boolean);

// --- Add aggregate over the 8 weeks ---
const bimonthlyAggregated = aggregateData(mappedWeeks, "bimonthly (8-week aggregate)");
bimonthlyAggregated.baseline=wILIBaseline
mappedWeeks.unshift(bimonthlyAggregated);

// --- Return trends ---
return res.json(mappedWeeks)


  } catch (err) {
    console.error("Error fetching FluView trends:", err.message);
    next(err);
  }
});


// router.get("/trends/:state", async (req, res, next) => {
//   try {
//     let { state } = req.params;
//     state = state.toLowerCase();
    
//     const wILIBaseline = state === "nat"
//     ? wILIBaselines.nat: wILIBaselines.states[state];

//     const validStates = [
//       "nat","al","ak","az","ar","ca","co","ct","de","fl","ga","hi","id","il","in","ia","ks",
//       "ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc",
//       "nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy"
//     ];
//     if (!validStates.includes(state)) return res.status(400).json({ error: `Invalid state: ${state}` });

//     // --- Fetch data from Delphi FluView ---
//     const baseUrl = "https://delphi.cmu.edu/epidata/api.php";
//     let url = `${baseUrl}?source=fluview&regions=${state}&epiweeks=200000-999999`;
//     if (DELPHI_API_KEY) url += `&api_key=${DELPHI_API_KEY}`;
    
//     console.log("Fetching FluView trends from URL:", url);

//     const resp = await axios.get(url);

//     console.log("API response received");

//     const epidata = resp.data?.epidata || [];

//     if (!epidata.length) return res.json([]);

//     // --- Sort descending by epiweek and select the most recent 8 weeks ---
//     const sortedData = epidata.sort((a, b) => b.epiweek - a.epiweek);
//     const recentWeeks = sortedData.slice(0, 8);
//     // --- Map weeks safely with full structure (including age fields) ---

//     const mappedWeeks = recentWeeks
//       .map(entry => mapFluViewData({ epidata: [entry] })).filter(Boolean);

// // --- Add aggregate over the 8 weeks ---
// const bimonthlyAggregated = aggregateData(mappedWeeks, "bimonthly (8-week aggregate)");
// mappedWeeks.unshift(bimonthlyAggregated);

// // --- Return trends ---
// return res.json(mappedWeeks)


//   } catch (err) {
//     console.error("Error fetching FluView trends:", err.message);
//     next(err);
//   }
// });


module.exports = router;
