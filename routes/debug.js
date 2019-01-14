var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;
var seq = require("./resources/postGresData").seq


//Tells when Debug is Loaded
console.log("Debug Options Loaded");
route.get("/version", function(req,res){
    res.send("1.0");
});

//Logging

const log = require("./resources/postGresData").log;

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

route.get("/createLogTable", (req,res) => {
    log.sync({
    }).then((result) => {
        res.send("log table created")
    })
})

//Garages

const garage = require("./resources/postGresData").garage

const markers = require("./resources/postGresData").markers

route.get("/resetMarkers", (req, res) => {
    markers.sync({
        force: true
    }).then((result) => {
        res.send("Markers have been reset");
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


module.exports = route;