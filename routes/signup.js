var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

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

const signup = seqSign.define("signup", {
});

module.exports = route;
