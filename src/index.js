import express from "express";
const app = express();
import Sequelize from "sequelize";
import pg from "pg";
import bodyParser from "body-parser";
import { runInNewContext } from "vm";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
pg.defaults.ssl = true;



const seq = new Sequelize("postgres://bmsnyakizhvtiv:9ca4b6e65fd79862767d73971fdbf0da9d1de25422281b63e8a7ca8214e72c9b@ec2-54-163-234-88.compute-1.amazonaws.com:5432/delahu46rivvsb", {
  ssl: true
})

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

const emailModel = seq.define("registrations", {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  driver: Sequelize.BOOLEAN,
  carMake: Sequelize.STRING,
  carModel: Sequelize.STRING,
  carYear: Sequelize.INTEGER
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
  let fName =req.body.firstName;
  let lName = req.body.lastName;
  let password = req.body.password;

  //check if any attributes are null
  if(email && fName && lName && password){
    //check if valid email
    if(email.substring(email.length-9, email.length) != "@sjsu.edu"){
      res.send("Invalid email")
    }
    //check password is at least 8 long and has one lowercase, uppercase,number and special char
    let passVer= true;
    let strong = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if(!(strong.test(password)))
      passVer = false;
    if(!passVer){
      res.send("Invalid password")
    }
    //if  password and email is valid, sent the pass link to the email
    else{
      email = email
      for(let i=0; i< email.length-9; i++){
        if(email.charAt(i) == '+'){
          email = email.substring(0,i) + email.substring(email.length-9, email.length);
        break;
        }
      }
      if(email && fName && lName && password){
        emailModel.findOrCreate({
          where:{
            email: email,
          },
          defaults:{
            email: email,
            firstName: fName,
            lastName: lName,
            password: password,
            driver: false,
            carMake: null,
            carModel: null,
            carYear: null,
            active: false,
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

    }
  }
    
});  

app.get("/verifyAccount", (req, res) => {

  console.log(req.protocol+":/"+req.get('host'));
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
      {
          emailModel.findOne({
            where: { 
              email: req.query.email
            } 
          }).then( email => {
            email.update({
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

app.post("/driverVerification", (req, res) => {
  let license = req.licenseNumber

  //see if email exists
  emailModel.findOne({
      where: {
          email: req.body.email
      }
  }).then(result => {
      if(result){
          //check if license is valid (change this later)
          let valid = true;
          if(valid){
              result.driver = true;
              result.carMake = req.body.carMake;
              result.carModel = req.body.carModel;
              result.carYear = req.body.carYear;
              result.save().then(() => {
                res.send("save the car information to profile page")
              })
          }
          else
              res.send(false)
      }
          else
              res.send(false)
      })
  
})

//change the information data in the database
app.post("/changeProfile", (req, res) => {
  let newfName = req.body.firstName;
  let newlName = req.body.lastName;
  let newpassword = req.body.password;
  let newcarMake = req.body.carMake;
  let newcarModel = req.body.carModel;
  let newcarYear = req.body.carYear;
    emailModel.findOne({
      where: {
        email: req.body.email
      }
    }).then(result => {
      result.update({
        firstName: newfName,
        lastName: newlName,
        password: newpassword,
        carMake: newcarMake,
        carModel: newcarModel,
        carYear: newcarYear,
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
    let carMake = result.dataValues.carMake;
    let carModel = result.dataValues.carModel;
    let carYear = result.dataValues.carYear;
    res.send(firstName + ", " + lastName + ", " + email + ", " + password + ", " + carMake + ", " + carModel + ", "+ carYear);
    })
});

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
});

//stripe 
require('dotenv').config();
const keyPublishable = process.env.STRIPE_PUBLIC;
const stripe = require('stripe')(process.env.STRIPE_SECRET);

app.post('/charge', (req, res, next) => {

  const token = req.body.stripeToken;
  
  stripe.customers.create({
      //email: req.body.email,
      source: "tok_visa"
  })
  .then(customer => 
  
  stripe.charges.create({
    amount: 500,
    currency: 'usd',
    customer: customer.id,
    description: 'carpool',
  }))
  .then(charge => res.send('Thank you')
  ).catch(error  => {
    res.send(error); 
  });
});








app.listen(3000);