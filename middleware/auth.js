
/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = require("../config");
const Report=require("../models/report")
const { UnauthorizedError, ForbiddenError } = require("../expressError");


function authenticateJWT(req, res, next) {
  try {
    console.log("inside authJWT()")
    console.log("this is req.headers in authJWT---->", req.headers)
    console.log("this is req.headers.authorization in authJWT---->", req.headers.authorization)
    const authHeader = req.headers && req.headers.authorization;
    console.log("this is authHeader in authJWT---->", authHeader)
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      console.log("this is the token---->", token)
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next(new UnauthorizedError("❌ Invalid or expired token"));
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    console.log("inside ensureLoggedIN()", "this is res.locals.user----->", res.locals.user)
    if (!res.locals.user) throw new UnauthorizedError("❌ Login Required.");
    console.log("token is valid moving to next middleware or route...")
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureIsAdmin(req,res,next){
    try{
        console.log("inside ensureIsAdmin", "this is res.locals.user----->", res.locals.user)
        if(res.locals.user.is_admin === true){
            console.log("user is a valid admin and is allowed to GET, PATCH, and DELETE users/!")
             return next()
        }

       else{
        console.log("invalid or nonadmin token detected" )
        throw new ForbiddenError("❌ Admin Access is required.")
       }

    }
    catch(err){
        return next (err)
    }
}

function ensureIsAdminOrUser(req,res,next){
  try{
    console.log("inside ensureIsAdminOrUser", "this is res.locals.user----->", res.locals.user)
    if(res.locals.user.is_admin === true || res.locals.user.username === req.params.username){
      if(res.locals.user.is_admin===true){
        console.log("✅ User ID match — access granted.");
      }
      if(res.locals.user.username === req.params.username){
        console.log("✅ Username match — access granted.");
      }
      return next()
    }
    else{
      throw new ForbiddenError("❌ User must be an admin or owning user.");
    }
  }
  catch(err){
    return next(err)
  }

}

function ensureIsAdminOrUserId(req,res,next){
  try{
    console.log("inside ensureIsAdminOrUserId", "this is res.locals.user----->", res.locals.user)
    numCocercedId=Number(req.params.id)
    if(res.locals.user.is_admin === true || res.locals.user.id === numCocercedId){
      if(res.locals.user.is_admin===true){
        console.log("✅ Admin access granted.");
      }
      if(res.locals.user.id === numCocercedId){
        console.log("✅ User ID match — access granted.");
      }
      return next()
    }
    else{
      throw new ForbiddenError("❌ User must be an admin or owning user.");
    }
  }
  catch(err){
    return next(err)
  }

}
// a quick fix for a naming issue until I refactor to unify
function ensureIsAdminOrUserIdv2(req,res,next){
  try{
    console.log("inside ensureIsAdminOrUserId", "this is res.locals.user----->", res.locals.user)
    const numCocercedId=Number(req.params.userId)
    if(res.locals.user.is_admin === true || res.locals.user.id === numCocercedId){
      if(res.locals.user.is_admin===true){
        console.log("✅ Admin access granted.");
      }
      if(res.locals.user.id === numCocercedId){
        console.log("✅ User ID match — access granted.");
      }
      return next()
    }
    else{
      throw new ForbiddenError("❌ User must be an admin or owning user.");
    }
  }
  catch(err){
    return next(err)
  }

}




function createToken(user) {
    console.assert(user.is_admin === false,
      "createToken passed user without is_admin property");
      console.assert(user.is_admin === true,
      "createToken passed user with is_admin property");
    let payload = {
    id:user.id,
    username: user.username,
    is_admin: user.is_admin || false,
  };

  console.log("Creating token for user:", user);


  return jwt.sign(payload, SECRET_KEY);
}

/** Middleware: ensure the logged-in user is either an admin or the owner of the report.
 *  Fetches the report and stores it in res.locals.report.
 */
async function ensureIsAdminOrReportOwner(req,res,next){
  try{
    console.log("inside ensureIsAdminOrReportOwner", "this is res.locals.user----->", res.locals.user)

    const reportId=req.params.id
    const report=await Report.getReportByIdAllFields(reportId)
      if(!report){
            throw new NotFoundError(`report not found for id: ${reportId}`, 404)
        }
      
      const user=res.locals.user

      if(user.is_admin === true || res.locals.user.id === report.user_id){

        if(res.locals.user.is_admin===true){
          console.log("✅ Admin access granted.");
        }

        if(res.locals.user.id === report.user_id){
          console.log("✅ User ID match — access granted.");
        }
        res.locals.report = report;
        return next()
            
        }
        else{
            throw new ForbiddenError("❌ You do not have permission to access this report.");
        }
  }
  catch(err){
    return next(err)
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureIsAdminOrUser,
  ensureIsAdminOrUserId,
  ensureIsAdminOrUserIdv2,
  ensureIsAdminOrReportOwner,
  createToken
};



