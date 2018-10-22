//Imports Dependencies
var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;


//Initializes Connection to Database
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

//Creates a Table (Model)
const signup = seqSign.define("signup", {
});

//Exports this module to be used in the main app
module.exports = route;
