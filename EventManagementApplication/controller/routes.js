var express = require('express');
var router = express.Router();
var connectionDB=require("../utility/connectionDB");
var bodyParser = require("body-parser");
var categories = [];
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/connection',function(req,res){
  if(Object.keys(req.query).length > 0){
      if(req.query.connectionId != ""){
          if(req.query.connectionId.length > 6){
            if(req.query.connectionId.substr(0,3) === "CID" && !isNaN(parseInt(req.query.connectionId.substr(3,req.query.connectionId.length-1)) ) )
            {
                            connectionDB.getConnection(req.query.connectionId, function(err, connectionFor){
                                    if(err){
                                      res.redirect("/connections");
                                    }
                                    else{
                                      res.render("connection", {connectionFor: connectionFor, action: "", user: req.session.theUser ? req.session.theUser.fname: ''});
                                    }
                                  });
            }}}}
    });


router.get("/connections", function(req,res){
    if(!req.session.theUser) {
      res.redirect('/?invalidAccess='+ true);
      return;
    }
    connectionDB.getConnections(function(err, connections){
          if(err){
            res.render("connections", {connections: [], categories: [],  user: req.session.theUser ? req.session.theUser.fname: ''});
            }
          else {

            if(connections !== undefined){
              for(i = 0; i< connections.length; i++){
                  if(categories.indexOf(connections[i].ctopic) === -1){
                      categories.push(connections[i].ctopic);
                  }
              }
            }
            res.render("connections", {connections: connections, categories: categories,  user: req.session.theUser ? req.session.theUser.fname: ''});
          }
        });
});

module.exports = router;
