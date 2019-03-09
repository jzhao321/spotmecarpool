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

const emailModel = seq.define("registrations", {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phoneNumber: Sequelize.BIGINT,
});

// curl localhost:3000/createTable

app.get("/createTable", (req, res) => {
  	emailModel.sync({
          force: true
      }).then(() => {
      res.send("Table created successfully");
    }).catch((error) => {
      res.send(error);
    })
});

app.post("/createAccount", (req, res) => {
  let email = req.body.email;
  let fName = req.body.firstName;
  let lName = req.body.lastName;
  let phone = req.body.phoneNumber;
  let password = req.body.password;
  
	if(email && fName && lName && phone && password){
    emailModel.findOrCreate({
      where:{
        $or:{
        email: email,
        phoneNumber:phone
        }
      },
      defaults:{
          email: email,
          password: password,
          firstName: fName,
          lastName: lName,
          phoneNumber: phone
      }
    }).then((result) => {
        res.send(result);
    })
      
    
  }
  else{
    res.send("fail to create account");
  }
})

app.post("/loginValidation", (req, res) => {
	emailModel.findOne({
    where: {
      email: req.body.email
    }
  }).then(result => {
      console.log(result);
    if(result){
      
      if(req.body.password === result.dataValues.password){
        res.send("Successfully logged in");
      }
      
      else{
        res.send("Error Logging In");
      }
      
    }
    else{
      res.send("Error Logging In")
    }
    
  })
})
  

app.listen(3000);