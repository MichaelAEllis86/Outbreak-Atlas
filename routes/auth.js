/** Routes for user auth. */

const jsonschema = require("jsonschema");
const express = require("express");
const router = express.Router();
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, ExpressError, } = require("../expressError");
const User = require("../models/user");
const userRegisterSchema = require("../schemas/userRegisterSchema.json");
const userLoginSchema = require("../schemas/userLoginSchema.json");
const { createToken } = require("../middleware/auth");

router.post("/register", async function (req, res, next) {
  try {
    console.log("inside register route", "this is req.body--->", req.body)
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.registerNewUser(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async function (req,res,next){
  try{
    console.log("inside login route", "this is req.body--->", req.body)
    const validator = jsonschema.validate(req.body, userLoginSchema)
    if(!validator.valid){
      const errs= validator.errors.map(e => e.stack);
      throw new BadRequestError(errs)
    }
    const user=await User.authenticateUser(req.body)
    const token=createToken(user)
    return res.json({ token });

  }
  catch(err){
    return next(err);
  }
})

module.exports = router;