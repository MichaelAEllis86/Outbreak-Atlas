//models/report.js
const db = require("../db.js");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const User = require("./user");
const {sqlForPartialUpdate} =require("../utils/sqlUpdateHelper.js")
const { getDateRange } = require("../utils/datehelpers");
const { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError,} = require("../expressError.js");


/**
 * Reports Class, represents a report in the db
 * handles creation,update,deletion and retrival of report data.
 */

class Report {

    static symptomCategoryMap = {
        cough: "Respiratory",
        congestion: "Respiratory",
        sneezing: "Respiratory",
        nausea: "Gastrointestinal",
        vomiting: "Gastrointestinal",
        diarrhea: "Gastrointestinal",
        rash: "Dermal",
        fever: "General",
        fatigue: "General",
        headache: "Neurological",
        chills: "General",
        bodyache: "General",
  };
     /** Helper to get categories for a list of symptoms */
    static getCategoriesFromSymptoms(symptoms = []) {
        const categoryCounts = {};
        symptoms.forEach(symptom => {
            const category = Report.symptomCategoryMap[symptom] || "Other";
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        return categoryCounts;
    }

    static aggregateReportData(reports, range) {
        if (!reports.length) return null;

        let totalReports = reports.length;
        let totalTemperature = 0;
        let averageTemperature = 0;
        let symptomCounts = {};
        let categoryCounts = {};
        let severityCounts = { mild: 0, moderate: 0, severe: 0 };
        let stateLocationCounts = {};
        let zipLocationCounts = {};
        let reportsWithLocation = 0;

        reports.forEach(report => {
            totalTemperature += report.temperature || 0;

            // Count symptoms
            (report.symptoms || []).forEach(symptom => {
                symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
            });

            // Count categories
            const reportCategoryCounts = Report.getCategoriesFromSymptoms(report.symptoms);
            for (const [category, count] of Object.entries(reportCategoryCounts)) {
                categoryCounts[category] = (categoryCounts[category] || 0) + count;
            }

            // Count severity
            if (report.severity && severityCounts.hasOwnProperty(report.severity)) {
                severityCounts[report.severity]++;
            }

            // Location counts
            if (report.state) {
                stateLocationCounts[report.state] = (stateLocationCounts[report.state] || 0) + 1;
            }
            if (report.zipcode) {
                zipLocationCounts[report.zipcode] = (zipLocationCounts[report.zipcode] || 0) + 1;
            }
            if (report.latitude && report.longitude) reportsWithLocation++;
        });

        averageTemperature = totalReports ? totalTemperature / totalReports : 0;
        console.log("total temp--->", totalTemperature, "total reports--->", totalReports, "average temp--->", averageTemperature);
    
        return {
            range: range,
            totalReports,
            averageTemperature,
            symptomCounts,
            categoryCounts,
            severityCounts,
            stateLocationCounts,
            zipLocationCounts,
            reportsWithLocation,
        };
    }

    static formatWeekLabel(date) {
      // Example: "Week of Sep 1, 2025"
      const options = { month: "short", day: "numeric", year: "numeric" };
      return `Week of ${date.toLocaleDateString("en-US", options)}`;
    }

  static groupReportsByWeek(reports) {
    const weeks = {};
    reports.forEach((report) => {
      const date = new Date(report.created_at);

    // Calculate start of week (Sunday = 0, so subtract day)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().slice(0, 10);
      const weekLabel = Report.formatWeekLabel(weekStart);

      if (!weeks[weekKey]) {
        weeks[weekKey] = { weekLabel, reports: [] };
    }
      weeks[weekKey].reports.push(report);
    });

    // Aggregate each week's reports
    return Object.values(weeks).map((week) => ({
      weekLabel: week.weekLabel,
      ...Report.aggregateReportData(week.reports, "week"),
    }));
  }


    static async createNewReport(
        {   user_id, 
            primary_symptom, 
            symptoms, 
            severity, 
            temperature, 
            notes, 
            zipcode,
            state,  
            latitude, 
            longitude}) 
        {
        const result=await db.query(`INSERT INTO
            reports(
            user_id,
            primary_symptom,
            symptoms,
            severity,
            temperature,
            notes,
            zipcode,
            state,
            latitude,
            longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING * `, [user_id, primary_symptom, symptoms, severity, temperature, notes, zipcode, state, latitude, longitude])
        
        const report=result.rows[0]

        return report
    }

    static async getAllReports(){
        const result=await db.query(
            `SELECT * FROM reports ORDER BY id `
        )
        const reports=result.rows
        const aggregated=Report.aggregateReportData(reports,"all")
        const weeklyData=Report.groupReportsByWeek(reports)
        return {reports, aggregated, weeklyData}
    }

    static async getReportByIdAllFields(id){
      const result=await db.query (`SELECT * FROM reports WHERE id=$1`,[id])
      const report=result.rows[0]

      if(!report){
        throw new NotFoundError (`report not found for id: ${id}`, 404)
      }
      return report
    }

    static async getReportByIdLimitedFields(id){
        const result=await db.query(`SELECT 
            id, 
            created_at, 
            primary_symptom, 
            symptoms, 
            severity, 
            temperature, 
            zipcode, 
            state, 
            latitude, 
            longitude, 
            has_location FROM reports WHERE id =$1`, [id])
        
        const report=result.rows[0]

        if(!report){
            throw new NotFoundError (`report not found for id: ${id}`, 404)
        }
        return report
    }

    static async getUserReports(user_id){
        const userResult=await db.query(`SELECT id FROM users WHERE id=$1`,[user_id])
        const user=userResult.rows[0]

        if (!user){
            throw new NotFoundError(`no user found for id: ${user_id}`, 404)
        }
        const reportResults=await db.query(`SELECT * FROM reports WHERE user_id=$1 ORDER BY created_at`,[user_id])
        const reports=reportResults.rows
        const aggregated=Report.aggregateReportData(reports,"all")
        const weeklyData=Report.groupReportsByWeek(reports)
        console.log("this is weekly data--->", weeklyData)
        return {reports, aggregated, weeklyData}
    }

    static async getUserReportsPaginated(user_id, { page = 1, limit = 10 }){
      const userResult=await db.query(`SELECT id FROM users WHERE id=$1`,[user_id])
      const user=userResult.rows[0]
       if (!user){
            throw new NotFoundError(`no user found for id: ${user_id}`, 404)
        }
        const offset = (page - 1) * limit;
        const totalRes = await db.query(`SELECT COUNT(*) FROM reports WHERE user_id = $1`, [user_id]);
        const totalCount = parseInt(totalRes.rows[0].count, 10);
        const reportResults=await db.query(`SELECT * FROM reports WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,[user_id, limit, offset])
        const reports =reportResults.rows
         return {reports, totalCount, page, totalPages: Math.ceil(totalCount / limit)}
  };

    static async getReportsbyZipcode(zipcode){
        const result=await db.query(`SELECT * FROM reports WHERE zipcode = $1 ORDER BY created_at`, [zipcode])
        const reports= result.rows;
        const aggregated=Report.aggregateReportData(reports,"all")
        const weeklyData=Report.groupReportsByWeek(reports)
        return {reports, aggregated, weeklyData}
    }

    // requires timestamp formatting for filtering by start or end! If it doesnt look like a timestamp it doesn't work need to change.
    // static async filterReports({ order="created_at", direction="DESC", zipcode, state, start, end, severity, symptom, primary_symptom, min_temp, max_temp, has_location, limit=100, page=1 }) {

    //     const orderConditionSQLStatements={
    //         created_at: ` ORDER BY created_at`,
    //         zipcode:  ` ORDER BY zipcode`,
    //         state:  ` ORDER BY state, zipcode`,
    //         severity:  ` ORDER BY CASE severity
    //         WHEN 'mild' THEN 1
    //         WHEN 'moderate' THEN 2
    //         WHEN 'severe' THEN 3
    //         END`,
    //         temperature:` ORDER BY temperature`
    //     }

    //     // Cap limit to avoid massive responses! default to 100 but user can ask to 500 should they wish.
    //     if (limit > 500) limit = 500;

    //     let baseQuery = `FROM reports WHERE 1=1`;
    //     const values = [];
    //     let idx = 1;

    //     if (zipcode) {
    //         baseQuery += ` AND zipcode = $${idx++}`;
    //         values.push(zipcode);
    //      }
        
    //     if(state){
    //         baseQuery += ` AND state = $${idx++}`;
    //         values.push(state)
    //     }
         
    //     if (start) {
    //         baseQuery += ` AND created_at >= $${idx++}`;
    //         values.push(start);
    //     }

    //     if (end) {
    //         baseQuery += ` AND created_at <= $${idx++}`;
    //         values.push(end);
    //     }

    //     if (severity) {
    //         baseQuery += ` AND severity = $${idx++}`;
    //         values.push(severity);
    //     }
        
    //     if (symptom) {
    //         baseQuery += ` AND symptoms @> ARRAY[$${idx++}]`;
    //         values.push(symptom);
    //     }

    //     if (primary_symptom) {
    //         baseQuery += ` AND primary_symptom = $${idx++}`;
    //         values.push(primary_symptom);
    //     }

    //     if(min_temp){
    //         baseQuery+= ` AND temperature >= $${idx++}`;
    //         values.push(min_temp)
    //     }

    //     if (max_temp){
    //         baseQuery+=` AND temperature <= $${idx++}`;
    //         values.push(max_temp)
    //     }

    //     if (has_location !== undefined) {
    //         baseQuery += has_location ? ` AND has_location = TRUE` : ` AND has_location = FALSE`;
    //     }
    //     // validate order keys! they should have a match to orderConditionSQLStatements obj
    //     if (!orderConditionSQLStatements[order]) {
    //         throw new BadRequestError(`Invalid order field: ${order}`);
    //     }
    //     // flex sorting direction. user specifies order in form and to list results to ascending or descending. If they don't specify then descending order.
    //     const normalizedDirection =direction.toUpperCase() === "ASC" ? "ASC" : "DESC"; // default DESC
    //     const offset = (page - 1) * limit;

    //     // Count total (no limit/offset)
    //     const totalQuery = `SELECT COUNT(*) ${baseQuery}`;
    //     const totalResult = await db.query(totalQuery, values);
    //     const totalCount = parseInt(totalResult.rows[0].count, 10);

    //     // build the final query
    //     const dataQuery = `SELECT * ${baseQuery} ${orderConditionSQLStatements[order]} ${normalizedDirection} LIMIT $${idx++} OFFSET $${idx++}`;
    //     const dataResult = await db.query(dataQuery, [...values, limit, offset]);
    //     return {
    //         reports: dataResult.rows,
    //         totalCount,
    //         page,
    //         totalPages: Math.ceil(totalCount / limit),
    //     };
    // }
    static async getTrendingReports(locationType,locationValue){
        // validate locationType
        if (!["nat", "state", "zipcode"].includes(locationType)) {
            throw new BadRequestError("Location type must be nat, state, or zipcode");
        }

        // Set date range: last 8 weeks
        const end = new Date();              // now
        const start = new Date(end);         // copy of now
        start.setDate(end.getDate() - 8 * 7); // 8 weeks ago

        let sql = `SELECT * FROM reports WHERE created_at BETWEEN $1 AND $2`;
        const values = [start, end];

        if (locationType === "state") {
        sql += ` AND state = $3`;
        values.push(locationValue);}

        else if (locationType === "zipcode") {
        sql += ` AND zipcode = $3`;
        values.push(locationValue);}
        sql += ` ORDER BY created_at DESC LIMIT 100`;

        const result = await db.query(sql, values);
        const reports = result.rows;
          // Aggregate data
        const aggregated = Report.aggregateReportData(reports, "8weeks");
        const weeklyData = Report.groupReportsByWeek(reports);
        console.log("this is weekly data--->", weeklyData);
     return {
        reports,
        aggregated,
        weeklyData,
        totalCount: reports.length,
        page: 1,
        totalPages: 1,
    };

    }

    static async filterReports({
        order = "created_at",
        direction = "DESC",
        locationType,
        locationValue,
        range,
        severity,
        symptom,
        primary_symptom,
        min_temp,
        max_temp,
        has_location,
        limit = 100,
        page = 1}) {
  const orderConditionSQLStatements = {
    created_at: ` ORDER BY created_at`,
    zipcode: ` ORDER BY zipcode`,
    state: ` ORDER BY state, zipcode`,
    severity: ` ORDER BY CASE severity
                WHEN 'mild' THEN 1
                WHEN 'moderate' THEN 2
                WHEN 'severe' THEN 3 END`,
    temperature: ` ORDER BY temperature`
  };

  if (limit > 500) limit = 500;

  let baseQuery = `FROM reports WHERE 1=1`;
  const values = [];
  let idx = 1;

  // 🔒 enforce stock ranges + location
  if (!range || !["week", "month", "year"].includes(range)) {
    throw new BadRequestError("Range must be one of: week, month, year");
  }
  if (!locationType || !["nat", "state", "zipcode"].includes(locationType)) {
    throw new BadRequestError("Location type must be nat, state, or zipcode");
  }
  if (locationType !== "nat" && !locationValue) {
    throw new BadRequestError("Location value required for state or zipcode");
  }

  // Add date range filter
  const { start, end } = getDateRange(range);
  baseQuery += ` AND created_at BETWEEN $${idx++} AND $${idx++}`;
  values.push(start, end);

  // Add location filter
  if (locationType === "state") {
    baseQuery += ` AND state = $${idx++}`;
    values.push(locationValue);
  } else if (locationType === "zipcode") {
    baseQuery += ` AND zipcode = $${idx++}`;
    values.push(locationValue);
  }
  // if nat → no filter needed

  // ✅ keep the other filters
  if (severity) {
    baseQuery += ` AND severity = $${idx++}`;
    values.push(severity);
  }

  if (symptom) {
    baseQuery += ` AND symptoms @> ARRAY[$${idx++}]`;
    values.push(symptom);
  }

  if (primary_symptom) {
    baseQuery += ` AND primary_symptom = $${idx++}`;
    values.push(primary_symptom);
  }

  if (min_temp) {
    baseQuery += ` AND temperature >= $${idx++}`;
    values.push(min_temp);
  }

  if (max_temp) {
    baseQuery += ` AND temperature <= $${idx++}`;
    values.push(max_temp);
  }

  if (has_location !== undefined) {
    baseQuery += has_location ? ` AND has_location = TRUE` : ` AND has_location = FALSE`;
  }

  // ✅ validate order keys
  if (!orderConditionSQLStatements[order]) {
    throw new BadRequestError(`Invalid order field: ${order}`);
  }

  const normalizedDirection = direction.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const offset = (page - 1) * limit;

  // Count total
  const totalQuery = `SELECT COUNT(*) ${baseQuery}`;
  const totalResult = await db.query(totalQuery, values);
  const totalCount = parseInt(totalResult.rows[0].count, 10);

  // Build final query
  const dataQuery = `SELECT * ${baseQuery} ${orderConditionSQLStatements[order]} ${normalizedDirection} LIMIT $${idx++} OFFSET $${idx++}`;
  console.log("Final data query:", dataQuery);
  const dataResult = await db.query(dataQuery, [...values, limit, offset]);
  const aggregateReportData = Report.aggregateReportData(dataResult.rows, range);

  return {
    reports: dataResult.rows,
    aggregated : aggregateReportData,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}


    static async deleteReport(id){

        const result=await db.query(`
            DELETE FROM reports WHERE id=$1 RETURNING id, created_at`, [id])
        
        const report=result.rows[0]

        if (!report){
            throw new NotFoundError("report not found", 404)
        }

        return {deleted:report}

    }

    static async updateReport(id, data){

        const {setCols, values}=sqlForPartialUpdate(data)
        
        const idVarIdx = `$${values.length + 1}`;

        const querySQL =`UPDATE reports SET ${setCols} WHERE id = ${idVarIdx}
        RETURNING *`

        const result=await db.query(querySQL, [...values,id]);
        const report=result.rows[0]

        if (!report){
            throw new NotFoundError("report not found", 404)
        }
        return report;
    }



}

module.exports=Report