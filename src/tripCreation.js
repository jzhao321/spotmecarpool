import express from "express";
const app = express();
import Sequelize from "sequelize";
import pg from "pg";

import bodyParser from "body-parser";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
import { RSA_NO_PADDING } from "constants";
pg.defaults.ssl = true;

const seq = new Sequelize("postgres://bmsnyakizhvtiv:9ca4b6e65fd79862767d73971fdbf0da9d1de25422281b63e8a7ca8214e72c9b@ec2-54-163-234-88.compute-1.amazonaws.com:5432/delahu46rivvsb", {
  ssl: true
})

const riderlistings = seq.define("riderlistings",{
    rider:Sequelize.STRING,
    pickUpStNo:Sequelize.STRING,
    pickUpStName: Sequelize.STRING,
    pickUpCity:Sequelize.STRING,
    pickUpZip:Sequelize.STRING,
    destinationStNo:Sequelize.STRING,
    destinationStName: Sequelize.STRING,
    destinationCity:Sequelize.STRING,
    destinationZip:Sequelize.STRING,
    starttime: Sequelize.DATE,
    endtime: Sequelize.DATE,

});
const driverlistings = seq.define("driverlistings",{
  driver:Sequelize.STRING,
  pickUpStNo:Sequelize.STRING,
  pickUpStName: Sequelize.STRING,
  pickUpCity:Sequelize.STRING,
  pickUpZip:Sequelize.STRING,
  destinationStNo:Sequelize.STRING,
  destinationStName: Sequelize.STRING,
  destinationCity:Sequelize.STRING,
  destinationZip:Sequelize.STRING,
  starttime: Sequelize.DATE,
  endtime: Sequelize.DATE,

});

app.get("/createRiderlistings", (req, res) => {
    riderlistings.sync({
        force: true
    }).then(() => {
    res.send("riderlistings created successfully");
  }).catch((error) => {
    res.send(error);
  })

});

app.get("/createDriverlistings", (req, res) => {

driverlistings.sync({
  force: true
}).then(() => {
  res.send("driverlistings created successfully");
}).catch((error) => {
  res.send(error);
})
});

app.post("/riderAddTrip",(req,res) => {
    let user =req.body.rider;
    let pStNo =req.body.pickUpStNo ;
    let pStName =req.body.pickUpStName;
    let pCity =req.body.pickUpCity;
    let pZip =req.body.pickUpZip;
    let dStNo =req.body.destinationStNo;
    let dStName =req.body.destinationStName;
    let dCity =req.body.destinationCity;
    let dZip =req.body.destinationZip;
    let stime=req.body.starttime;
    let etime=req.body.endtime;
   

    if(user && pStNo && pStName && pCity && pZip
        && dStNo && dStName && dCity && dZip&& stime&&etime){
        riderlistings.findOrCreate({
         where:{
          rider:user,
          $or: {
            starttime:stime,
             endtime:etime,
          }
        },
          defaults:{
            rider:user,
            pickUpStNo:pStNo,
            pickUpStName: pStName,
            pickUpCity:pCity,
            pickUpZip:pZip,
            destinationStNo:dStNo,
            destinationStName: dStName,
            destinationCity:dCity,
            destinationZip:dZip,
            starttime:stime,
            endtime:etime,
          }
        }).then((result) => {

            res.send(result[1]);
        })
        }
      else{
        res.send("input field not completed, rider add trip failed");
      }
});

app.post("/driverAddTrip",(req,res) => {
  let user =req.body.driver;
  let pStNo =req.body.pickUpStNo ;
  let pStName =req.body.pickUpStName;
  let pCity =req.body.pickUpCity;
  let pZip =req.body.pickUpZip;
  let dStNo =req.body.destinationStNo;
  let dStName =req.body.destinationStName;
  let dCity =req.body.destinationCity;
  let dZip =req.body.destinationZip;
  let stime=req.body.starttime;
  let etime=req.body.endtime;
 

  if(user && pStNo && pStName && pCity && pZip
      && dStNo && dStName && dCity && dZip&& stime&&etime){
      driverlistings.findOrCreate({
       where:{
        driver:user,
        $or: {
          starttime:stime,
           endtime:etime,
        }
      },
        defaults:{
          driver:user,
          pickUpStNo:pStNo,
          pickUpStName: pStName,
          pickUpCity:pCity,
          pickUpZip:pZip,
          destinationStNo:dStNo,
          destinationStName: dStName,
          destinationCity:dCity,
          destinationZip:dZip,
          starttime:stime,
          endtime:etime,
        }
      }).then((result) => {

          res.send(result[1]);
      })
      }
    else{
      res.send("input field not completed, rider add trip failed");
    }
});

app.post("/ridertripHistory", (req, res) => {
    let user=req.body.user;
    riderlistings.findAll({
      limit: 3,         //only retun 3 most recent history 
      order: [['starttime', 'DESC']],
      attributes:[
       "rider",
       "starttime",
       "endtime",
       "pickUpStNo",
       "pickUpStName",
       "pickUpCity",
       "pickUpZip",
       "destinationStNo",
       "destinationStName",
       "destinationCity",
       "destinationZip"]   ,
      where: { 
          rider:user
      
    },
      }).then((result) => {

          res.send(result);
      })
    
})

app.post("/drivertripHistory", (req, res) => {
  let user=req.body.user;
  
      driverlistings.findAll({
        limit: 3,         //only retun 3 most recent history 
        order: [['starttime', 'DESC']],
        attributes:[
         "driver",
         "starttime",
         "endtime",
         "pickUpStNo",
         "pickUpStName",
         "pickUpCity",
         "pickUpZip",
         "destinationStNo",
         "destinationStName",
         "destinationCity",
         "destinationZip"]   ,
        where: { 
            driver:user
        }
        }).then((result) => {

            res.send(result);
        })
      
        
      
      
})

app.listen(3000);