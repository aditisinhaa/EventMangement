var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.render('index', {"user":(req.session.theUser?req.session.theUser.fname:""), "invalidAccess": req.query && req.query.invalidAccess ? req.query.invalidAccess : false});
    });

router.get('/index',function(req,res){
    res.render('index', {"user":(req.session.theUser?req.session.theUser.fname:""), "invalidAccess": req.query && req.query.invalidAccess ? req.query.invalidAccess : false});
    });

router.get('/saved-connections',function(req,res){
  res.render("saved-connections", {"connectionFor" : ((req.session.userProfile)? req.session.userProfile.userProfileModel.listOfUserConnection :[]),"user":(req.session.theUser?req.session.theUser.fname:"")});
    });

router.get('/about',function(req,res){
    res.render('about', {"user":(req.session.theUser?req.session.theUser.fname:"")});
    });


router.get('/contact',function(req,res){
    res.render('contact', {"user":(req.session.theUser?req.session.theUser.fname:"")});
    });

router.get('/newConnection',function(req,res){
  if(!req.session.theUser) {
    res.redirect('/?invalidAccess='+ true);
    return;
  }
    res.render('newConnection', {"user":(req.session.theUser?req.session.theUser.fname:""),errorData:""});
    });

    router.get('/login',function(req,res){
        res.render('login', {"user":(req.session.theUser?req.session.theUser.fname:""),errorData:"", "invalidAccess": req.query && req.query.invalidAccess ? req.query.invalidAccess : false});
        });
module.exports = router;
