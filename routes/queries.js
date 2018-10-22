//Imports Dependencies
var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;


//Initializes Connection to Database
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

//Creates a Table (Model)
const query = spotQuery.define("spotQueries",{
    location: Sequelize.STRING,
    time: Sequelize.BIGINT
});


//Takes in location and adds a query into the spot finder queue
route.get("/createQuery", function(req,res){
    query.create({
        location: req.query.location,
        time: Date.now()
    }).then(function(result){
        res.send(JSON.stringify(result));
    }).catch(function(err){
        res.send(err.toString());
    });

});

//Takes in location and time and looks for a matching query in the spot finder queue
route.get("/getQuery", function(req,res){
    query.find({
        where:{
            location: req.query.location,
            time: {
                [Op.lte]: parseInt(req.query.time)
            }
        }
    }).then(function(result){
        res.send(result);
    });
});

//Checks if 'createQuery' has a location value
query.beforeCreate(function(instance){
    if(instance.location == null){
        throw new Error("This Query does not have a location");
    }
});

//Does nothing right now
query.beforeFind(function(instance){
    console.log(instance);
});


//Exports this module to be used in the main app
module.exports = route;