//Imports Dependencies
var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

const garage = require("./resources/postGresData").garage;

const markers = require("./resources/postGresData").markers;

const log = require("./resources/postGresData").log;


route.get("/garage", function(req, res){
    garage.findOne({
        where:{
            name: req.query.name
        },
        attributes:{
            exclude: ["createdAt","updatedAt"]
        }

    }).then(function(result){
        res.send(JSON.stringify(result));
    });
});

//Takes in an API Key, location, and command, logs the request, and updates the current number of spots
route.get("/log_garage", function(req, res){
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
            upCount: Sequelize.literal('"' + count + '"' + " + 1"),
            current: Sequelize.literal("current +" + toadd)
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

                    res.send(JSON.stringify(result3))
            

                });

            });

        });
    }
    else{
        res.send("API Key Invalid");
    }
});

// Takes in an API Key, location, from time, to time, and count and returns an array of graph data to be used in a line graph
route.get("/getTime", function(req,res){
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
        //console.log(groups);
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



route.get("/setMarker", function(req, res){
    // markers.sync({
    //     force: true
    // }).then((result) => {
    //     res.send(JSON.stringify(result));
    // });
    markers.create({
        name: req.query.name,
        lat: req.query.lat,
        lng: req.query.lng,
        key: req.query.key
    }).then((result) => {
        res.send(JSON.stringify(result));
    });
});

route.get("/getMarkers", (req, res) => {
    markers.findAll({
    }).then((result) => {
        res.send(JSON.stringify(result));
    });
});


//Exports this module to be used in the main app
module.exports = route;