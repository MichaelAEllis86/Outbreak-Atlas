// routes/covid.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const { formatDateLabel } = require("../utils/epiweek");
const API_KEY = process.env.DELPHI_API_KEY;

const DATA_SOURCE = "jhu-csse";
const SIGNAL = "confirmed_7dav_incidence_prop";

// Helper to format YYYYMMDD string
const formatYYYYMMDD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  return `${y}${m}${d}`;
};

// Helper to compute weekly aggregation from daily data
const aggregateWeekly = (days) => {
  const weeks = [];
  let currentWeek = [];
  days.forEach((day, idx) => {
    currentWeek.push(day);
    // Every 7 days or at end
    if ((idx + 1) % 7 === 0 || idx === days.length - 1) {
      const avg = currentWeek.reduce((sum, d) => sum + d.value, 0) / currentWeek.length;
      weeks.push({
        start_date: currentWeek[0].date,
        end_date: currentWeek[currentWeek.length - 1].date,
        average_value: avg,
        days: currentWeek
      });
      currentWeek = [];
    }
  });
  return weeks;
};

router.get("/:state/:range", async (req, res, next) => {
  try {
    let { state, range } = req.params;
    state = state.toLowerCase();

    const validStates = [
      "us","al","ak","az","ar","ca","co","ct","de","fl","ga","hi","id","il","in","ia","ks",
      "ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc",
      "nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy"
    ];
    
    if (!validStates.includes(state)) return res.status(400).json({ error: `Invalid state: ${state}` });

    const validRanges = ["day", "week", "month"];
    if (!validRanges.includes(range.toLowerCase())) return res.status(400).json({ error: `Invalid range: ${range}` });

    // Step 1: Determine date range
    const now = new Date();
    let startDate = new Date(now);
    if (range === "week") startDate.setDate(now.getDate() - 6);
    else if (range === "month") startDate.setDate(now.getDate() - 29);

    const start = formatYYYYMMDD(startDate);
    const end = formatYYYYMMDD(now);

    // Step 2: Fetch daily data for range
    const url = `https://api.delphi.cmu.edu/epidata/covidcast/` +
                `?data_source=${DATA_SOURCE}` +
                `&signal=${SIGNAL}` +
                `&geo_type=state&geo_values=${state}` +
                `&time_type=day&time_values=${start}-${end}` +
                (API_KEY ? `&api_key=${API_KEY}` : "");

    console.log("Fetching daily data:", url);
    const resp = await axios.get(url);
    console.log("API response:", resp.data);

    const epidata = resp.data.epidata || [];
    if (!epidata.length) return res.json([]);

    // Step 3: Map daily data
    const days = epidata.map(d => ({
      date: d.time_value,
      label: `Day of ${formatDateLabel(parseInt(d.time_value))}`,
      value: d.value,
      issue: d.issue,
      direction: d.direction
    }));

    // Step 4: Aggregate weekly
    const weeks = aggregateWeekly(days);

    // Step 5: Compute month average if needed
    let month_totals = null;
    if (range === "month") {
      const avg = days.reduce((sum, d) => sum + d.value, 0) / days.length;
      month_totals = {
        label: `Last ${days.length} days average`,
        average_value: avg
      };
    }

    // Step 6: Return structured response
    return res.json({
      days,
      weeks,
      month_totals
    });

  } catch (err) {
    console.error("Error fetching Delphi COVIDcast data:", err.message);
    next(err);
  }
});

module.exports = router;

