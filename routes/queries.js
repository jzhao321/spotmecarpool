var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

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

query.beforeCreate(function(instance){
    if(instance.location == null){
        throw new Error("This Query does not have a location");
    }
});

query.beforeFind(function(instance){
    console.log(instance);
});


module.exports = route;