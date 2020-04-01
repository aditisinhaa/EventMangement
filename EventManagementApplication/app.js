var express=require('express');
var app=express();
var appRoot=require('app-root-path');
var session = require("express-session");
app.set('view engine','ejs');
app.set('views',appRoot+"/views");
app.use('/assets', express.static('assets'));
app.use(session({secret: "Milestone3"}));
var routes = require('./controller/routes.js')
var otherRoutes = require('./controller/routerForStaticPages.js')
var profileControl = require("./controller/ProfileController.js");

app.use("/",routes);
app.use("/",otherRoutes);
app.use("/", profileControl);


app.listen(8080);
