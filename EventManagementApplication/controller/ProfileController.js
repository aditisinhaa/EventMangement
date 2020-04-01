var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var bodyParser = require("body-parser");
const { buildSanitizeFunction } = require('express-validator');
const sanitizeBody = buildSanitizeFunction('body');
const { check, validationResult } = require('express-validator');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var userModel = require("../models/User.js");
var usersDB = require("../utility/UserDB.js");
var userConnDB = require("../utility/UserConnectionDB.js");
var connectionDB=require("../utility/connectionDB");
var userProfileModel = require("../models/userProfile.js");
var userConnectionModel = require("../models/userConnection.js");
var router = express.Router();


//the middleware method use to validate the user session
router.use(urlencodedParser,async function(request, response, next){
  if(request.query.action === "updateConnection"){
            if(request.body.viewConnId === request.query.connection){
              response.redirect("/saved-connections");
            }

  }
  next();

});

//this methhod is used to delete/add/update the connection
router.post("/saved-connections", urlencodedParser,[
  sanitizeBody('*').trim().blacklist()
], async function(request, response){
  if(request.query.action=== "deleteData")
  {
    if(request.session.userProfile)
    {
        if(request.body.viewConnId.indexOf(JSON.parse(request.query.connectionFor).connectionId) > -1){
            var userProfileModelCall = new userProfileModel.userProfile(request.session.userProfile.userProfileModel.userId, request.session.userProfile.userProfileModel.listOfUserConnection);
                  if(await userProfileModelCall.removeConnection(JSON.parse(request.query.connectionFor), request.session.theUser.userId)){
                    var listofConnections = await userProfileModelCall.getConnections(request.session.theUser.userId);
                    if(listofConnections !== undefined){
                      request.session.userProfile.userProfileModel.listOfUserConnection = listofConnections;
                      response.redirect("/saved-connections");
                    }
                  }
        }
        else {
          response.redirect("/saved-connections");
        }
    }
  }
  else if(request.query.action === "saveConnection"){
      if(request.session.userProfile)
      {
         if(request.body.viewConnId != (JSON.parse(request.query.connectionFor).connectionId))
        {
        response.redirect("/saved-connections");
        }
        else{
          if(request.query.rsvp === "Yes" || request.query.rsvp === "No" || request.query.rsvp === "Maybe"){
            var userProfileModelCall = new userProfileModel.userProfile(request.session.userProfile.userProfileModel.userId, request.session.userProfile.userProfileModel.listOfUserConnection);
                if(await userProfileModelCall.addConnection(JSON.parse(request.query.connectionFor),request.query.rsvp,request.session.theUser.userId))
                {
                    request.session.userProfile.userProfileModel.listOfUserConnection = await userProfileModelCall.getConnections(request.session.theUser.userId);
                    response.redirect("/saved-connections");
                }
          }
          else {
              response.redirect("/saved-connections");

          }
        }
      }
    }
    else if(request.query.action === "updateConnForUser")
          {
            if(request.session.userProfile)
            {
              if(request.query.rsvp === "Yes" || request.query.rsvp === "No" || request.query.rsvp === "Maybe"){
                var userProfileModelCall = new userProfileModel.userProfile(request.session.userProfile.userProfileModel.userId, request.session.userProfile.userProfileModel.listOfUserConnection);
                if(await userProfileModelCall.updateConnection({"connection": JSON.parse(request.query.connectionFor),"rsvp": request.query.rsvp}, request.session.theUser.userId))
                {
                    request.session.userProfile.userProfileModel.listOfUserConnection = await userProfileModelCall.getConnections(request.session.theUser.userId);
                    response.redirect("/saved-connections");
                }
              }
              else{
                response.redirect("/saved-connections");
              }
            }
          }
          else if(request.query.action=== "myConn")
          {
            response.redirect("/saved-connections");
          }
});

//this method is used to navigate to the particular connection on click of update
router.post("/connection", urlencodedParser,[
  sanitizeBody('*').trim().blacklist()
],function(request, response){
if(Object.keys(request.query).length > 0){
if(request.query.action === "updateConnection")
{
  if(request.query.connectionId != ""){
      if(request.query.connectionId.length > 6){
        if(request.query.connectionId.substr(0,3) === "CID" && !isNaN(parseInt(request.query.connectionId.substr(3,request.query.connectionId.length-1)) ) ){
            connectionDB.getConnection(request.query.connectionId, function(err, connectionFor){
                              if(err){
                                response.redirect("/connections");
                              }
                              else{
                                response.render("connection", {connectionFor: connectionFor, action: "updateConnection", user: request.session.theUser ? request.session.theUser.fname: ''});
                              }
                            });
        }
      }
    }
}
}
});


router.post("/connections", urlencodedParser,[
  check('cname','Invalid Connection name').isLength({min:1}),
  check('ctopic','Invalid Connection topic').isLength({min:1}),
  check('cdetail','Invalid Connection detail').isLength({min:1}),
  check('clocation','Invalid connection location').isLength({min:1}),
  check('ctime','Invalid connection time').isLength({min:1}),
  sanitizeBody('*').trim().blacklist()
],async function(req, resp){
  const errors = validationResult(req);
if(!errors.isEmpty())
{
resp.render("newConnection",{"user":(req.session.theUser?req.session.theUser.fname:""),errorData:errors.mapped()});
}
else{
          var dt =req.body.ctime;
          var splitDate= dt.split("T");
          var dateValue=moment(splitDate[0]).format('MMMM DD,YYYY')
          var cTime = dateValue + "  "+splitDate[1];
          var strImg='defaultValue';
          var connectionStr = {cname:req.body.cname,ctopic:req.body.ctopic,cdetail:req.body.cdetail,ctime:cTime,chost: (req.session.theUser?(req.session.theUser.fname+ " " + req.session.theUser.lname):""),clocation: req.body.clocation,cimg:strImg,userId: (req.session.theUser?req.session.theUser.userId:"")};
          if(await userConnDB.addConnection(connectionStr))
          {
            resp.redirect("/connections");
          }
          else {
            resp.redirect("/newConnection");
            }
  }
});

router.post("/signin", urlencodedParser,[
    check('username').isLength({ min: 1 }).isEmail().normalizeEmail().escape(),
    check('pwd').isLength({ min: 1 }).escape(),
    sanitizeBody('*').trim().blacklist()
  ], async function (request, response){
    if(request.query.action === "signin")
    {
    const errors = validationResult(request);
            if(!errors.isEmpty()){
                response.render('login', {"user":(request.session.theUser?request.session.theUser.fname:""),errorData:"Please Enter valid login details"});
            }
            else{
              request.session.theUser = null;
              var UserData = await usersDB.getUser(request.body.username);
                  if(UserData === null){
                    response.render('login', {"user":(request.session.theUser?request.session.theUser.fname:""),errorData:"Please Enter valid username"});
                    }
                    else{
                      passwordToHash=request.body.pwd+UserData.saltPassword;
                      var newhashPassword=hashPasswordConvert(request.body.pwd,UserData.saltPassword);
                      if(newhashPassword === UserData.hashPassword){
                      request.session.theUser = UserData;
                      var userProfileModelCall = new userProfileModel.userProfile(request.session.theUser.userId,[]);
                      userProfileModelCall.userProfileModel.listOfUserConnection = await userProfileModelCall.getConnections(request.session.theUser.userId);
                      request.session.userProfile = userProfileModelCall;
                      response.redirect("/saved-connections");
                    }
                    else {
                      response.render('login', {"user":(request.session.theUser?request.session.theUser.fname:""),errorData:"Please Enter valid Password"});
                    }
                    }

            }
          }
});


router.post("/logout", urlencodedParser, function(request, response){
  if(request.session.theUser)
      request.session.theUser = null;

  if(request.session.userProfile){
    request.session.userProfile = null;
  }
  response.redirect("/");
});

router.post("/login", urlencodedParser,function (request, response){
  response.redirect("/login");
});


function hashPasswordConvert(password,salt)
{
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
}
module.exports = router;
