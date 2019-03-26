
import express from "express";
const app = express();
import Sequelize from "sequelize";
import pg from "pg";
import bodyParser from "body-parser";
import { runInNewContext } from "vm";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
pg.defaults.ssl = true;



const seq = new Sequelize("postgres://bmsnyakizhvtiv:9ca4b6e65fd79862767d73971fdbf0da9d1de25422281b63e8a7ca8214e72c9b@ec2-54-163-234-88.compute-1.amazonaws.com:5432/delahu46rivvsb", {
  ssl: true
})

const emailModel = seq.define("registrations", {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
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
  let password = req.body.password
  
	if(email && fName && lName && password){
    emailModel.findOrCreate({
      where:{
        email: email
      },
      defaults:{
        email: email,
        firstName: fName,
        lastName: lName,
        password: password
      }
    }).then((result) => {
      res.send(result);
    }) 
    }
    else{
    res.send("error");
    }
});

app.post("/loginValidation", (req, res) => {
	emailModel.findOne({
    where: {
      email: req.body.email
    }
  }).then(result => {
    if(result){
      
      if(req.body.password === result.password){
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
});
//change the information data in the database
app.post("/changeProfile", (req, res) => {
  let newfName = req.body.firstName;
  let newlName = req.body.lastName;
  let newpassword = req.body.password
    emailModel.findOne({
      where: {
        email: req.body.email
      }
    }).then(result => {
      result.update({
        firstName: newfName,
        lastName: newlName,
        password: newpassword,
      }).then(() => {
        res.send("update successfully")
      })
    })
});
//show the account information
app.get("/profile", (req, res) => {
  emailModel.findOne({
    where:{
      email: req.body.email
    }
  }).then((result) => {
    let firstName = result.dataValues.firstName;
    let lastName = result.dataValues.lastName;
    let email = result.dataValues.email;
    let password = result.dataValues.password;
    res.send(firstName + ", " + lastName + ", " + email + ", " + password);
    })
});

app.listen(1000);