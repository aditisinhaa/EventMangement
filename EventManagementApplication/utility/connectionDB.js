
var connection = require("../models/connection");

/*  to get all details for all the connections */
  var getConnections = function(callback){
  return connection.connectionModel.find({},{_id:0})
  .exec(function(err, connections) {
            callback(err, connections);
         });
};

/*  to get all details for a particular connectionId */
var getConnection = function(connectionId, callback){
  return connection.connectionModel.findOne({"connectionId": connectionId },{_id:0})
  .exec(function(err, connection) {
      callback(err, connection);
   });
};


 module.exports.getConnection = getConnection;
 module.exports.getConnections = getConnections;
