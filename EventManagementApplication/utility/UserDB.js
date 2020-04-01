
var user = require("../models/User");

//get all the users from userdetails table
var getAllUsers = function(){
  return new Promise((resolve, reject) =>{
    user.userModel.find({},{_id:0}).then((users)=>{
      resolve(users);
    }).catch((err)=>{
      return reject(err);
    });
  });
};

//get particular user from userdetails table
var getUser = function(emailId){
  return new Promise((resolve, reject) =>{
    user.userModel.findOne({"emailId": emailId},{_id:0}).then((user)=>{
      resolve(user);
    }).catch((err)=>{
      return reject(err);
    });
  });
};


 module.exports.getUser = getUser;
 module.exports.getAllUsers = getAllUsers;
