var mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/flairevents', {useNewUrlParser: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
      console.log('Connected to databse succesfully');
  });



var connectionSchema = new mongoose.Schema({
  connectionId:String,
  cname:String, ctopic:String,
  cdetail:String, ctime:String,
  chost: String,
  clocation: String,
  cimg:String,
  userId: String});

var connectionModel = mongoose.model('connectionModel', connectionSchema, "connections");


module.exports.connectionModel = connectionModel;
