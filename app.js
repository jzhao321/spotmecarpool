//Imports Dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require("sequelize");
var cors = require("cors");
var app = express();

//Adds Query operations in Sequelize
var Op = Sequelize.Op;

//Enables Cross Origin Requests (CORS) support
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));

// app.get("/Ddata", function(req,res){
//     garage.create({
//         name: "SJSUSouth",
//         current: 300,
//         max:500
        
//     }).then(function(result){
//         res.send(JSON.stringify(result));
//     });
// });


// app.get("/create", function(req,res){
//     garage.sync({force:true}).then(function(result){
//         console.log(result);
//     });
// });

// route.get("/allLogData", function(req,res){
//     log.findAll().then(function(result){
//         res.send(JSON.stringify(result));
//     });
// });

// route.get("/clearLogTable", function(req,res){
//     log.sync({
//         force: true
//     }).then(function(result){
//         res.send(JSON.stringify(result));
//     });
// });

// app.get("/create", function(req,res){
//     garage.sync({force:true}).then(function(result){
//         console.log(result);
//     });
// });

// app.get("/getTest", function(req,res){
//     garage.findAll().then(function(result){
//         var date = JSON.stringify(result[0].createdAt);
//         var date2 = new Date(date.substring(1,date.length - 1));
//         res.send(date2.getTime() + "");
//     });
// });



// app.get("/addColumn", function(req,res){
//    garage.update({
//        upCount: 0,
//        downCount: 0
//    }, {
//        where:{
//            name:["SJSouth", "SJWest", "SJNorth"]
//        }
//    }).then(function(result){
//        res.send(result);
//    });

// });

//Debug Endpoints NOT TO BE IN FINAL PRODUCT
// var debug = require("./routes/debug.js");
// app.use("/debug", debug);

//Product Endpoints
var garages = require("./routes/garages.js");
var logging = require("./routes/logging.js");
var queries = require("./routes/queries.js");
var signUps = require('./routes/signup');
app.use("/garages", garages);
app.use("/logging", logging);
app.use("/queries", queries);
app.use("/signups", signUps);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
