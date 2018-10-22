//Imports Dependencies
var express = require('express');
var route = express.Router();
var Sequelize = require("sequelize");
var Op = Sequelize.Op;


//Initializes Connection to Database
var logData = new Sequelize("garageTimeData", "root", "spot123", {
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
const log = logData.define("timeLog", {
  garage: Sequelize.STRING,
  current: Sequelize.INTEGER,
  time: Sequelize.BIGINT
});



// app.get("/log_garage", function(req, res){
//   if(req.query.API_KEY == "56ZXRQKLUO2i9P4DQMPH"){ //This is the API Key
//       var toadd = 0;
//       var count;
//       var date = new Date();
//       if(req.query.command == "out"){
//           toadd = -1;
//           count = "downCount";
//       }
//       else{
//           toadd = 1;
//           count = "upCount";
//       }
//       garage.update({
//           [count]: Sequelize.literal(count + " + 1"),
//           current: Sequelize.literal("current + 1")
//       }, {
//           where: {
//               name: req.query.location
//           }
//       }).then(function(result){

//           garage.find({
//               where:{
//                   name: req.query.location
//               }
//           }).then(function(result2){

//               log.create({
//                   garage: req.query.location,
//                   current: result2.current,
//                   time: date.getTime()
//               }).then(function(result3){

//                   res.send(JSON.stringify(result))
                  

//               });

//           });

//       });
//   }
//   else{
//       res.send("API Key Invalid");
//   }
// });


//Exports this module to be used in the main app
module.exports = route;
