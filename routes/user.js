/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, ExpressError, } = require("../expressError");
const User = require("../models/user");
const userRegisterSchema = require("../schemas/userRegisterSchema.json");
const userUpdateSchema = require("../schemas/userUpdateSchema.json");
const {ensureLoggedIn, ensureIsAdmin,  ensureIsAdminOrUser, ensureIsAdminOrUserId}= require("../middleware/auth");

const router=express.Router();

// **************************Resful user routes****************************

/**
 * GET /all
 *
 * Retrieves all users from the database.
 * - Only accessible to logged-in admin users.
 * - Returns a JSON object containing an array of users.
 *
 * Authorization:
 * - User must be logged in (`ensureLoggedIn` middleware).
 * - User must be an admin (`ensureIsAdmin` middleware).
 *
 * Response JSON:
 * {
 *   "users": [
 *     {
 *       "id": number,
 *       "username": string,
 *       "first_name": string,
 *       "last_name": string,
 *       "age": number,
 *       "zipcode": string,
 *       "state": string,
 *       "country": string,
 *       "created_at": string (ISO timestamp),
 *       "is_admin":boolean
 *     },
 *     ...
 *   ]
 * }
 *
 * Errors are passed to the error handler.
 */
router.get("/all", ensureLoggedIn, ensureIsAdmin, async function(req,res,next) {
  try{
    const users=await User.getAllUsers();
    return res.json({users})

  }
  catch(err){
    return next(err);
  }

});

router.get("/:id",ensureLoggedIn, ensureIsAdminOrUserId , async function(req,res,next) {
  try{
    const user=await User.getUserById(req.params.id)
    return res.json({ user });
  }
  catch(err){
    return next(err);
  }
  
})

router.get("/me", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = await User.getUserByUsername(res.locals.user.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", ensureLoggedIn, ensureIsAdminOrUserId, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.updateUserById(req.params.id, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureLoggedIn, ensureIsAdminOrUserId, async function (req, res, next) {
  try {
    const user=await User.deleteUserById(req.params.id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

// **************************routes for username associated lookup****************************

router.get("/username/:username",ensureLoggedIn, ensureIsAdminOrUser, async function(req,res,next) {
  try{
    const user=await User.getUserByUsername(req.params.username)
    return res.json({ user });
  }
  catch(err){
    return next(err);
  }
  
})

router.patch("/username/:username", ensureLoggedIn, ensureIsAdminOrUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.updateUserByUsername(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/username/:username", ensureLoggedIn, ensureIsAdminOrUser, async function (req, res, next) {
  try {
    const user=await User.deleteUserByUsername(req.params.username);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
