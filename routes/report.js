// routes/report.js
/** Routes for reports. */

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, ExpressError, } = require("../expressError");
const Report = require("../models/report");
const reportCreateSchema = require("../schemas/reportCreateSchema.json");
const reportUpdateSchema=require("../schemas/reportUpdateSchema.json")
const reportFilterSchema=require("../schemas/reportFilterSchema.json")
const {sanitizeQueryParams}= require("../utils/querycoverter")
const {ensureLoggedIn, ensureIsAdmin,  ensureIsAdminOrUser, ensureIsAdminOrUserId, ensureIsAdminOrReportOwner, ensureIsAdminOrUserIdv2}= require("../middleware/auth");

const router=express.Router();

router.get("/all", ensureLoggedIn, ensureIsAdmin, async function (req,res,next){
    try{
        const reports=await Report.getAllReports();
        return res.json({reports})
    }
    catch(err){
        return next(err);
    }
}  )

router.get("/trending", async function (req,res,next){
    try{
        const { locationType, locationValue } = req.query;

         // Validate locationType
        if (!["nat", "state", "zipcode"].includes(locationType)) {
            throw new BadRequestError("locationType must be one of: nat, state, zipcode");
        }

        // Validate locationValue if needed
        if (locationType !== "nat" && !locationValue) {
            throw new BadRequestError("locationValue is required for state or zipcode");
        }
       
        const reports=await Report.getTrendingReports(locationType, locationValue);
        return res.json({reports})
    }
    catch(err){
        return next(err);
    }   
})

router.get("/filter", async function (req,res,next){
    try{
        console.log("inside filter report route GET /filter", "this is req.query--->",req.query)
        // santize query parameters to correct types (numbers, booleans, etc)
        const sanitizedQuery=sanitizeQueryParams(req.query,["min_temp", "max_temp", "limit", "page"],["has_location"]);
        console.log("this is req.query after santization--->", sanitizedQuery)
         // ensure there is one query parameter. We don't want to return EVERY record to the user
        if (Object.keys(sanitizedQuery).length === 0){
            throw new BadRequestError("At least one filter parameter is required.");
        }

       
        // validate query parameters
        const validator = jsonschema.validate(sanitizedQuery, reportFilterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            console.log("these are the validation errors", errs);
            throw new BadRequestError(errs);}

        const reports = await Report.filterReports(sanitizedQuery)

        return res.json({reports})

    }
    catch(err){
        return next(err);
    }
})

router.post("/", ensureLoggedIn, async function (req,res,next){
    try{
        // mutating req.body to include user_id that we take from res.locals! we either need to do this or redo the jsonschema
        req.body.user_id = res.locals.user.id;
        console.log("inside create report route POST /", "this is req.body--->",req.body)
        const validator =jsonschema.validate(req.body, reportCreateSchema);
        if(!validator.valid){
            const errs=validator.errors.map(e => e.stack);
            throw new BadRequestError(errs); 
        }
        const user_id=res.locals.user.id
        const report=await Report.createNewReport(req.body);
        return res.status(201).json({report})

    }
    catch(err){
        return next(err);
    }
})

router.get("/:id", async function (req,res,next){
    try{
        console.log("inside report route GET /:id ", "this is req.body--->",req.body)
        const report=await Report.getReportByIdAllFields(req.params.id)
        return res.json({report})
    }
    catch(err){
        return next(err);
    }
} )

// the ensureIsAdminOrUserIdv2 is VERY IMPORTANT to checking the correct param which is userId The other version is looking for /:id we need to unify the naming!!!
router.get("/user/:userId/aggregated", ensureLoggedIn, ensureIsAdminOrUserIdv2, async function (req,res,next){
    try{
        console.log("inside report route GET /user/:userId ", "this is req.body--->",req.body)
        const reports=await Report.getUserReports(req.params.userId)
        return res.json({reports})

    }
    catch(err){
        return next(err);   
    }

})

router.get("/user/:userId", ensureLoggedIn, ensureIsAdminOrUserIdv2, async function (req,res,next){
    try{
        console.log("inside report route GET /user/:userId paginated ", "this is req.body--->",req.body)
        console.log("inside report route GET /user/:userId paginated ", "this is req.query--->",req.query)
        const { page = 1, limit = 10 } = req.query
        const reportData=await Report.getUserReportsPaginated(req.params.userId, {page:Number(page), limit:Number(limit)});
        return res.json({ reports:reportData.reports, page: reportData.page, totalPages: reportData.totalPages, totalCount: reportData.totalCount });
    }
    catch(err){
        return next(err);   
    }

})


router.delete("/:id", ensureLoggedIn, ensureIsAdminOrReportOwner, async function (req,res,next){
    try{
        const report=await Report.deleteReport(req.params.id)
        return res.json(report)
    }
    catch(err){
        return next(err)
    }
})

router.patch("/:id", ensureLoggedIn, ensureIsAdminOrReportOwner, async function (req,res,next){
    try{
        const validator = jsonschema.validate(req.body, reportUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        
        const report=await Report.updateReport(req.params.id, req.body)
        return res.json({report})

    }
    catch(err){
        return next(err)
    }

})

module.exports = router;



