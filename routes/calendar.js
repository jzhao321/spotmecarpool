var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;
/*hi there Jame, you just tricked me into thinking that you
were going to take a picture of the screen.*/
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

/*oh hi there again */
route.get("/createEvent", function(req,res){
    cal.create({
        eventName: req.query.name,
        eventDate: parseInt(req.query.date)
    }).then(function(result){
        res.send(JSON.stringify(result));
    });
});

route.get("/delEvent", function(req,res){
    cal.destroy({
        where:{
            eventName: req.query.name
        }
    }).then(function(result){
        res.send(result);
    });
});

route.get("/getAll", function(req,res){
    cal.findAll({}).then(function(result){
        res.send(JSON.stringify(result));
    });
});

/* oh well looky here, I popped up again */
module.exports = route;
/*bye */