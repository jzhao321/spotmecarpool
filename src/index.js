import express from "express";
const app = express();
import Sequelize from "sequelize";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

/*
  Configuring the SMTP Server through nodemailer.
  We are using Gmail to send and receive emails.
*/
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "spotmecarpool@gmail.com",
    pass: "Carpool2019"
  }
});
var rand,mailOptions,host,link;
/*-------------------------------------------*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

import pg from "pg";
import { randomBytes } from "crypto";
pg.defaults.ssl = true;

const seq = new Sequelize("postgres://bmsnyakizhvtiv:9ca4b6e65fd79862767d73971fdbf0da9d1de25422281b63e8a7ca8214e72c9b@ec2-54-163-234-88.compute-1.amazonaws.com:5432/delahu46rivvsb", {
  ssl: true
})

const userModel = seq.define("registrations", {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phoneNumber: Sequelize.BIGINT,
  active: Sequelize.BOOLEAN
});

// curl localhost:3000/createTable

app.get("/createTable", (req, res) => {
  	userModel.sync({
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
    userModel.findOrCreate({
      where:{
        email: email,
      },
      defaults:{
        email: email,
      	firstName: fName,
        lastName: lName,
        phoneNumber: phone,
        password: password,
        active: false
      }
    }).then((result) => {

      if(result[1]){
        console.log(result)
              
        rand = Math.floor((Math.random() * 100) + 54);
        host = req.get('host');
        link = "http://"+host+"/verifyAccount?id="+rand+"&email="+email;
        mailOptions={
          to: email,
          subject: "Please confirm your E-mail account",
          html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
        }
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
            console.log(error);
          } else {
            console.log("Message sent: " + response.message);
          }
        });
        res.send("Account created please verify")
      } 
      else{
        console.log(result)
        res.send("Account with e-mail already exists")
      }
    });
  }
  else{
     res.send("Not enought fields entered");
  }

});
  
app.get("/verifyAccount", (req, res) => {

  console.log(req.protocol+":/"+req.get('host'));
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
      {
          userModel.findOne({
            where: { 
              email: req.query.email
            } 
          }).then( user => {
            user.update({
              active: true
            })
          })
          console.log("email is verified");
          res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
      }
      else
      {
          console.log("email is not verified");
          res.end("<h1>Bad Request</h1>");
      }
  }
  else
  {
      res.end("<h1>Request is from unknown source");
  }

})

app.post("/loginValidation", (req, res) => {
	userModel.findOne({
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
})

app.listen(3000);

// npm run build_start























