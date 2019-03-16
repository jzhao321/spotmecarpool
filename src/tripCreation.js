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
    driver:Sequelize.STRING,
    rider:Sequelize.STRING,
    pickUpStNo:Sequelize.STRING,
    pickUpStName: Sequelize.STRING,
    pickUpCity:Sequelize.STRING,
    pickUpZip:Sequelize.STRING,
    destinationStNo:Sequelize.STRING,
    destinationStName: Sequelize.STRING,
    destinationCity:Sequelize.STRING,
    destinationZip:Sequelize.STRING,
    time: Sequelize.DATE,
    

});

app.get("/createTripTable", (req, res) => {
    riderlistings.sync({
        force: true
    }).then(() => {
    res.send("Table created successfully");
  }).catch((error) => {
    res.send(error);
  })
});

app.post("/addTrip",(req,res) => {
    let driver =req.body.driver;
    let rider =req.body.rider;
    let pStNo =req.body.pickUpStNo ;
    let pStName =req.body.pickUpStName;
    let pCity =req.body.pickUpCity;
    let pZip =req.body.pickUpZip;
    let dStNo =req.body.destinationStNo;
    let dStName =req.body.destinationStName;
    let dCity =req.body.destinationCity;
    let dZip =req.body.destinationZip;
    let time=req.body.time;
   

    if((rider||driver) && pStNo && pStName && pCity && pZip
        && dStNo && dStName && dCity && dZip&& time){
        riderlistings.findOrCreate({
         where:{
          $or: [{
            driver:driver,
            time:time
           },
           {
             rider:rider,
             time:time
           }]
          
          },
          defaults:{
            driver:driver,
            rider:rider,
            pickUpStNo:pStNo,
            pickUpStName: pStName,
            pickUpCity:pCity,
            pickUpZip:pZip,
            destinationStNo:dStNo,
            destinationStName: dStName,
            destinationCity:dCity,
            destinationZip:dZip,
            time:time
        
          }
        }).then((result) => {

            res.send(result[1]);
        })
          
        
        }
      else{
        res.send("input field not completed");
      }
});

app.post("/tripHistory", (req, res) => {
    let user=req.body.user;
    
    riderlistings.findAll({
        limit: 3,         //only retun 3 most recent history 
        order: [['time', 'DESC']],
        attributes:[
         "driver",
         "rider",
         "time",
         "pickUpStNo",
         "pickUpStName",
         "pickUpCity",
         "pickUpZip",
         "destinationStNo",
         "destinationStName",
         "destinationCity",
         "destinationZip"]   ,
        where: { 
          $or:{
            driver:user,
            rider:user}
        }
        }).then((result) => {

            res.send(result);
        })
          
        
})


app.listen(3000);