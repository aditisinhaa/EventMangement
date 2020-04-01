var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/flairevents', {useNewUrlParser: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
    console.log('Connected to databse succesfully');
});

var userConnection = new mongoose.Schema({
  userId:String,
  connection: Object,
  rsvp: String});
  
var userConnectionModel = mongoose.model('userConnectionModel', userConnection, "userConnection");

module.exports.userConnectionModel = userConnectionModel;
