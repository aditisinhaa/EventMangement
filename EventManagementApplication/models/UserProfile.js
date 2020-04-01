var userConnectionDB = require('../utility/UserConnectionDB.js');

var userProfile = function(userId, listOfUserConnection){
 this.userProfileModel = {userId:userId, listOfUserConnection:listOfUserConnection};
 this.iterObj = this.userProfileModel.listOfUserConnection;
};

//this method return all the connections
userProfile.prototype.getConnections = function(userID){
  var getUserData = userConnectionDB.getUserProfile(userID);
  return new Promise((resolve, reject) =>{
    getUserData.exec()
    .then((userConnections) => {
      resolve(userConnections);
    }).catch((err)=>{
      return reject(err);
    });
  });
};

//this method adds the connection
userProfile.prototype.addConnection = function(ConnectionData, rsvp, userID){
  try{
    var addConnnection = userConnectionDB.addRSVP(ConnectionData, rsvp, userID);
    return new Promise((resolve, reject) =>{
      addConnnection.exec()
      .then(() => {
        resolve(true);
      }).catch((err)=>{
        return reject(err);
      });
    });
  }
  catch(ex)
  {
    return false;
  }

};

//this method updates the connection
userProfile.prototype.updateConnection = async function(userConnection, userID){
  try{
      var updateRSVPForConn = userConnectionDB.updateRSVP(userConnection.connection.connectionId, userConnection.rsvp, userID);
      return new Promise((resolve, reject) =>{
        updateRSVPForConn.exec()
        .then(() => {
          resolve(true);
        }).catch((err)=>{
          return reject(err);
        });
      });
  }
  catch(ex){
    return false;
  }
};
//this method remove the particular connection from connections table
userProfile.prototype.removeConnection = async function(Connection, userID){
  try{
    //var findUserConnection = userConnectionDB.findUserConnection(Connection.connectionId, userID);

    return new Promise((resolve, reject) =>{
        var deleteRSVP = userConnectionDB.deleteRSVP(Connection.connectionId,userID);
        deleteRSVP.then(()=>{
          resolve(true);
        }).catch((err)=>{
          return reject(err);
        });
    });
  }
  catch(ex){
    return false;
  }
};



userProfile.prototype.emptyProfile = function(){
  this.userProfileModel = null;
  return true;
};

module.exports.userProfile = userProfile;
