var express = require("express");
var Sequelize = require("sequelize");



var seq = new Sequelize(process.env.DATABASE_URL);

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

const markers = seq.define("markers", {
    name: Sequelize.STRING,
    lat: Sequelize["DOUBLE PRECISION"],
    lng: Sequelize["DOUBLE PRECISION"],
    key: Sequelize.STRING
});

const log = seq.define("timeLog", {
    garage: Sequelize.STRING,
    current: Sequelize.INTEGER,
    time: Sequelize.BIGINT
});


module.exports.seq = seq;

module.exports.garage = garage;

module.exports.markers = markers;

module.exports.log = log;