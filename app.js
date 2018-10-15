var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require("sequelize");
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors());

var route = express.Router();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


var seq = new Sequelize("spotme_garages", "root", "spot123", {
    host: "35.227.173.37",
    dialect: "mysql",
    operatorsAliases:false,

    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const garage = seq.define("garage", {
    name: {
        type: Sequelize.STRING
    },
    current:{
        type: Sequelize.INTEGER
    },
    max:{
        type: Sequelize.INTEGER
    }
});

app.get("/", function(req,res){
    res.send("Spot Me Solutions API");
});


route.get("/allData", function(req,res){
    garage.findAll().then(function(result){
        res.send(JSON.stringify(result));
    });
});

route.get("/test", function(req,res){
    res.send("Test123");
});

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

route.get("/testConnect", function(req,res){
    seq.authenticate().then(function(errors){
        res.send("Connection Established");
    }).catch(function(err){
        console.error("Unable to connect to the database: ", err);
        res.send("Unable to connect to the database");
    });
});

route.post("/addGarage", function(req,res){
    garage.create({
        name: req.body.name,
        current: req.body.current,
        max: req.body.max
    }).then(function(result){
        res.send(JSON.stringify(result));
    });
});

route.post("/delGarage", function(req,res){
    garage.destroy({
        where: {
            name: req.body.name
        }
    }).then(function(result){
        res.send(JSON.stringify(result));
    });
});

// app.get("/create", function(req,res){
//     garage.sync({force:true}).then(function(result){
//         console.log(result);
//     });
// });

app.post("/garage", function(req, res){
    garage.find({
        where:{
            name: req.body.name
        },
        attributes:{
            exclude: ["createdAt","updatedAt"]
        }

    }).then(function(result){
        res.send(JSON.stringify(result));
    });
});



app.use("/debug", route);



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
