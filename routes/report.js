/** Routes for reports. */

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, ExpressError, } = require("../expressError");
const Report = require("../models/report");
const reportCreateSchema = require("../schemas/reportCreateSchema.json");
const reportUpdateSchema=require("../schemas/reportUpdateSchema.json")
const reportFilterSchema=require("../schemas/reportFilterSchema.json")
const {ensureLoggedIn, ensureIsAdmin,  ensureIsAdminOrUser, ensureIsAdminOrUserId, ensureIsAdminOrReportOwner}= require("../middleware/auth");

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

router.get("/filter", async function (req,res,next){
    try{
        console.log("inside filter report route GET /filter", "this is req.query--->",req.query)
        // ensure there is one query parameter. We don't want to return EVERY record to the user
        if (Object.keys(req.query).length === 0){
            throw new BadRequestError("At least one filter parameter is required.");
        }

        // validate query parameters
        const validator=jsonschema.validate(req.query,reportFilterSchema);
        if(!validator.valid){
            // noLocationError params require one of state or zipcode. If not provided throw a custom badrequest error message.
            const noLocationError = validator.errors.find(err =>
                err.name === "anyOf") // error from the "anyOf" requirement not being fufilled
            if (noLocationError){
                throw new BadRequestError("You must provide either a zipcode or a state as a query parameter.");
            } 

            const errs=validator.errors.map(e => e.stack);
            console.log("these are the validation errors", errs)
            throw new BadRequestError(errs);
        }
        const reports = await Report.filterReports(req.query)

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



