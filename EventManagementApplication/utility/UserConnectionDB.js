var userconnections = require('../models/userConnection');


var getUserProfile = function(userID){
  return userconnections.userConnectionModel.find({userId: userID},{_id:0});
};


var addRSVP = function(Connection, rsvp, userID){
  return userconnections.userConnectionModel.updateOne({"userId": userID, "connection.connectionId": Connection.connectionId},
       {"userId":userID,"connection":Connection, "rsvp":rsvp}, {upsert: true});
};


var updateRSVP = function(ConnectionID, rsvp, userID){
  return userconnections.userConnectionModel.updateOne({"userId": userID, "connection.connectionId": ConnectionID},
       {"rsvp":rsvp});
};


var deleteRSVP = function(ConnectionId,userID){
  return new Promise((resolve, reject) =>{
    userconnections.userConnectionModel.deleteOne({userId: userID, "connection.connectionId": ConnectionId}).then(()=>{
      resolve(true);
    }).catch((err)=>{
      return reject(err);
    });
  });
};

var findUserConnection =  function(ConnectionID, userID){
 return userconnections.userConnectionModel.findOne({userId: userID, "connection.connectionId": ConnectionID});
};

var addConnection = function(Connection){
  return new Promise((resolve, reject) =>{
    var conn = require("../models/connection");
    conn.connectionModel.findOne({}).sort({_id:-1}).exec()
    .then((record)=>{
      var getLastValue = (record.connectionId).split("D");
      var nextConnId = parseInt(getLastValue[1])+1;
      var newConn = new conn.connectionModel({connectionId:((nextConnId.toString().length==1)?"CID000"+nextConnId.toString():"CID0001" + nextConnId.toString()), cname:Connection.cname, ctopic:Connection.ctopic, cdetail:Connection.cdetail, ctime:Connection.ctime, chost: Connection.chost, clocation:Connection.clocation,cimg:Connection.cimg,userId:Connection.userId});
      newConn.save().then(()=>{
        resolve(true);
      }).catch((err)=>{
        return reject(err);
      });
      resolve(true);
    }).catch((err)=>{
      return reject(err);
    });
  });
}

module.exports.getUserProfile = getUserProfile;
module.exports.addRSVP = addRSVP;
module.exports.updateRSVP = updateRSVP;
module.exports.deleteRSVP = deleteRSVP;
module.exports.findUserConnection = findUserConnection;
module.exports.addConnection = addConnection;
