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

var Op = Sequelize.Op;

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


var seqSign = new Sequelize("signups", "root", "spot123", {
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

var logData = new Sequelize("garageTimeData", "root", "spot123", {
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
    },
    upCount:{
        type: Sequelize.INTEGER
    },
    downCount:{
        type: Sequelize.INTEGER
    }
});

const signup = seqSign.define("signup", {
});

const log = logData.define("timeLog", {
    garage: Sequelize.STRING,
    current: Sequelize.INTEGER,
    time: Sequelize.BIGINT
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

route.get("/allData", function(req,res){
    garage.findAll().then(function(result){
        res.send(JSON.stringify(result));
    });
});

route.get("/allLogData", function(req,res){
    log.findAll().then(function(result){
        res.send(JSON.stringify(result));
    });
});

route.get("/clearLogTable", function(req,res){
    log.sync({
        force: true
    }).then(function(result){
        res.send(JSON.stringify(result));
    });
});

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

route.get("/updateGarage", function(req,res){
    garage.update({
        current:req.query.current,
        max: req.query.max,
        upCount: req.query.upCount,
        downCount: req.query.downCount
    },{
        where:{
            name: req.query.name
        }
    }).then(function(result){
        res.send(result);
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

app.get("/log_garage", function(req, res){
    if(req.query.API_KEY == "56ZXRQKLUO2i9P4DQMPH"){ //This is the API Key
        var toadd = 0;
        var count;
        var date = new Date();
        if(req.query.command == "out"){
            toadd = -1;
            count = "downCount";
        }
        else{
            toadd = 1;
            count = "upCount";
        }
        garage.update({
            [count]: Sequelize.literal(count + " + 1"),
            current: Sequelize.literal("current + 1")
        }, {
            where: {
                name: req.query.location
            }
        }).then(function(result){

            garage.find({
                where:{
                    name: req.query.location
                }
            }).then(function(result2){

                log.create({
                    garage: req.query.location,
                    current: result2.current,
                    time: date.getTime()
                }).then(function(result3){

                    res.send(JSON.stringify(result))
                    

                });

            });

        });
    }
    else{
        res.send("API Key Invalid");
    }
});

// app.get("/getTest", function(req,res){
//     garage.findAll().then(function(result){
//         var date = JSON.stringify(result[0].createdAt);
//         var date2 = new Date(date.substring(1,date.length - 1));
//         res.send(date2.getTime() + "");
//     });
// });

app.get("/fakeData", function(req,res){
    var date = Date.now();
    var count = 0;
    for(var i = (date - 604800000); i <= date; i += 3600000){
        log.create({
            garage:"SJSouth",
            current: count * 5,
            time: i
        })
        count++;
    }
    res.send(date + "");


});

app.get("/getTime", function(req,res){
    if(req.query.API_KEY == "56ZXRQKLUO2i9P4DQMPH"){
        var space = (parseInt(req.query.to) - parseInt(req.query.from)) / (parseInt(req.query.count) * 2) ;
        var groups = [];
        var average = [];
        for(var count = 0; count < req.query.count; count++){
            groups.push({
                min: Math.floor((parseInt(req.query.from ) + space * 2 * count) - space),
                max: Math.floor((parseInt(req.query.from ) + space * 2 * count) + space)
            });
        }
        console.log(groups);
        log.findAll({
            where:{
                garage: req.query.location,
                time: {
                    [Op.gt]: parseInt(req.query.from),
                    [Op.lt]: parseInt(req.query.to)
                }
            },
            attributes:{
                include:["current", "time"],
                exclude:["id", "garage", "createdAt", "updatedAt"]
            }
        }).then(function(result){
            for(var i = 0; i < groups.length; i++){
                var sum = 0;
                var count = 0;
                result.forEach(function(item,index){
                    if(item.time < groups[i].max && item.time >= groups[i].min){
                        sum += item.current;
                        count++;
                    }
                });
                average.push({
                    avg:sum / count,
                    time:(groups[i].max + groups[i].min) / 2
                });
            }
            res.send(JSON.stringify(average));
        });
    }
    else{
        res.send("API Key Invalid");
    }
});


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
