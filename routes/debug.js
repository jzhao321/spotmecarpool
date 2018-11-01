var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

//Tells when Debug is Loaded
console.log("Debug Options Loaded");
route.get("/version", function(req,res){
    res.send("1.0");
});

//Logging

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
  
const log = logData.define("timeLog", {
    garage: Sequelize.STRING,
    current: Sequelize.INTEGER,
    time: Sequelize.BIGINT
});

route.get("/fakeData", function(req,res){
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

//Garages

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
    },
    upCount:{
        type: Sequelize.INTEGER
    },
    downCount:{
        type: Sequelize.INTEGER
    }
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
        max: req.body.max,
        upCount: req.body.upCount,
        downCount: req.body.downCount
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

route.get("/allData", function(req,res){
    garage.findAll().then(function(result){
        res.send(JSON.stringify(result));
    });
});

//Queries

var spotQuery = new Sequelize("spotquery", "root", "spot123", {
    host: "35.227.173.37",
    dialect: "mysql",
    operatorsAliases:false,

    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000
    }
});

const query = spotQuery.define("spotQueries",{
    location: Sequelize.STRING,
    time: Sequelize.BIGINT
});

route.get("/allQueries", function(req,res){
    query.findAll({}).then(function(result){
        res.send(JSON.stringify(result));
    });
});

route.get("/createTable", function(req,res){
    query.sync({force: true}).then(function(result){
        res.send(JSON.stringify(result));
    });
});

query.beforeCreate(function(instance){
    if(instance.location == null){
        throw new Error("This Query does not have a location");
    }
});

query.beforeFind(function(instance){
    console.log(instance);
});


//Calendar

calSeq = new Sequelize("calendarEvents", "root", "spot123", {
    host: "35.227.173.37",
    dialect: "mysql",
    operatorsAliases: false,

    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


const cal = calSeq.define("events", {
    eventName: Sequelize.STRING,
    eventDate: Sequelize.BIGINT
});

route.get("/createCalendar", function(req,res){
    cal.sync({
        force: true
    }).then(function(result){
        res.send(JSON.stringify(result));
    });
});

module.exports = route;