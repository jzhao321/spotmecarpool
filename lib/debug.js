"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _postGresData = require("./resources/postGresData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = _express.default.Router();

//Tells when Debug is Loaded
console.log("Debug Options Loaded");
route.get("/version", function (req, res) {
  res.send("1.0");
}); //Logging

route.get("/fakeData", function (req, res) {
  var date = Date.now();
  var count = 0;

  for (var i = date - 604800000; i <= date; i += 3600000) {
    _postGresData.log.create({
      garage: "SJSouth",
      current: count * 5,
      time: i
    });

    count++;
  }

  res.send(date + "");
});
route.get("/allLogData", function (req, res) {
  _postGresData.log.findAll().then(function (result) {
    res.send(JSON.stringify(result));
  });
});
route.get("/clearLogTable", function (req, res) {
  _postGresData.log.sync({
    force: true
  }).then(function (result) {
    res.send(JSON.stringify(result));
  });
});
route.get("/createLogTable", function (req, res) {
  _postGresData.log.sync({}).then(function (result) {
    res.send("log table created");
  });
}); //Garages

route.get("/resetMarkers", function (req, res) {
  _postGresData.markers.sync({
    force: true
  }).then(function (result) {
    res.send("Markers have been reset");
  });
});
route.get("/testConnect", function (req, res) {
  _postGresData.seq.authenticate().then(function (errors) {
    res.send("Connection Established");
  }).catch(function (err) {
    console.error("Unable to connect to the database: ", err);
    res.send("Unable to connect to the database");
  });
});
route.get("/addGarage", function (req, res) {
  _postGresData.garage.create({
    name: req.body.name,
    current: req.body.current,
    max: req.body.max,
    upCount: req.body.upCount,
    downCount: req.body.downCount
  }).then(function (result) {
    res.send(JSON.stringify(result));
  });
});
route.get("/delGarage", function (req, res) {
  _postGresData.garage.destroy({
    where: {
      name: req.body.name
    }
  }).then(function (result) {
    res.send(JSON.stringify(result));
  });
});
route.get("/updateGarage", function (req, res) {
  _postGresData.garage.update({
    current: req.query.current,
    max: req.query.max,
    upCount: req.query.upCount,
    downCount: req.query.downCount
  }, {
    where: {
      name: req.query.name
    }
  }).then(function (result) {
    res.send(result);
  });
});
route.get("/allData", function (req, res) {
  _postGresData.garage.findAll().then(function (result) {
    res.send(JSON.stringify(result));
  });
});
var _default = route;
exports.default = _default;