import express from "express";
var route = express.Router();

import { seq, log, garage, markers } from "./resources/postGresData";


//Tells when Debug is Loaded
console.log("Debug Options Loaded");
route.get("/version", (req, res) => {
    res.send("1.0");
});

//Logging

route.get("/fakeData",(req, res) => {
    var date = Date.now();
    var count = 0;
    for (var i = (date - 604800000); i <= date; i += 3600000) {
        log.create({
            garage: "SJSouth",
            current: count * 5,
            time: i
        })
        count++;
    }
    res.send(date + "");


});

route.get("/allLogData", (req, res) => {
    log.findAll().then(function (result) {
        res.send(JSON.stringify(result));
    });
});

route.get("/clearLogTable", (req, res) => {
    log.sync({
        force: true
    }).then(function (result) {
        res.send(JSON.stringify(result));
    });
});

route.get("/createLogTable", (req, res) => {
    log.sync({
    }).then((result) => {
        res.send("log table created")
    })
})

//Garages

route.get("/resetMarkers", (req, res) => {
    markers.sync({
        force: true
    }).then((result) => {
        res.send("Markers have been reset");
    });
});

route.get("/testConnect", (req, res) => {
    seq.authenticate().then(function (errors) {
        res.send("Connection Established");
    }).catch((err) => {
        console.error("Unable to connect to the database: ", err);
        res.send("Unable to connect to the database");
    });
});

route.get("/addGarage", (req, res) => {
    garage.create({
        name: req.body.name,
        current: req.body.current,
        max: req.body.max,
        upCount: req.body.upCount,
        downCount: req.body.downCount
    }).then((result) => {
        res.send(JSON.stringify(result));
    });
});

route.get("/delGarage", (req, res) => {
    garage.destroy({
        where: {
            name: req.body.name
        }
    }).then((result) => {
        res.send(JSON.stringify(result));
    });
});

route.get("/updateGarage", (req, res) => {
    garage.update({
        current: req.query.current,
        max: req.query.max,
        upCount: req.query.upCount,
        downCount: req.query.downCount
    }, {
            where: {
                name: req.query.name
            }
        }).then((result) => {
            res.send(result);
        });
});

route.get("/allData", (req, res) => {
    garage.findAll().then((result) => {
        res.send(JSON.stringify(result));
    });
});

export default route;