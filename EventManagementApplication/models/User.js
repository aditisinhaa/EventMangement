var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/flairevents', {useNewUrlParser: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
    console.log('Connected to databse succesfully');
});

var userData = new mongoose.Schema({
  userId:String,
  fname:String,
  lname:String,
  emailId:String,
  address1:String,
  address2:String,
  city:String,
  state:String,
  zipCode:Number,
  country:String,
  saltPassword:String,
  hashPassword:String});
  
var userModel = mongoose.model('userModel', userData, "userdetails");

module.exports.userModel = userModel;
